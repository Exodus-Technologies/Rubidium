'use strict';

import formidable from 'formidable';
import { StatusCodes } from 'http-status-codes';
import {
  uploadPdfArchiveToS3Location,
  deleteIssueByKey,
  doesIssueS3BucketExist,
  createCoverImageS3Bucket,
  createIssueS3Bucket,
  doesCoverImageS3BucketExist,
  deleteCoverImageByKey,
  getIssueDistributionURI,
  getCoverImageDistributionURI,
  doesIssueObjectExist,
  doesCoverImageObjectExist,
  copyCoverImageObject,
  copyIssueObject
} from '../aws';
import {
  COVERIMAGE_MIME_TYPES,
  ISSUE_MIME_TYPES,
  MAX_FILE_SIZE_PDF
} from '../constants';
import {
  createIssue,
  updateIssueViews,
  getIssueById,
  deleteIssueById,
  getIssueByTitle,
  updateIssue,
  getIssues,
  getTotal,
  getNextIssueOrder
} from '../queries/issues';
import { internalServerErrorRequest, badRequest } from '../response-codes';
import { isEmpty } from '../utilities/objects';
import { removeSpaces } from '../utilities/strings';
import logger from '../logger';

exports.getPayloadFromFormRequest = async req => {
  const form = formidable({ multiples: true, maxFileSize: MAX_FILE_SIZE_PDF });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (isEmpty(fields)) reject('Form is empty.');
      const file = { ...fields, key: removeSpaces(fields.title) };
      if (!isEmpty(files)) {
        const {
          filepath: issuePath,
          mimetype: issueType,
          size: issueSize
        } = files['file'];
        const {
          filepath: coverImagePath,
          mimetype: coverImageType,
          size: coverImageSize
        } = files['coverImage'];
        resolve({
          ...file,
          issuePath,
          issueType,
          coverImagePath,
          coverImageType,
          issueSize,
          coverImageSize
        });
      } else {
        resolve(file);
      }
    });
    form.on('error', err => {
      logger.info('Error on form parse: ', err);
    });
    form.on('end', () => {
      logger.info('Form is finished processing.');
    });
  });
};

exports.getIssues = async query => {
  try {
    const issues = await getIssues(query);
    if (issues) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch for issue with query params.',
          issues
        }
      ];
    }
    return badRequest(`No issues found with selected query params.`);
  } catch (err) {
    logger.error('Error getting all issues: ', err);
    return internalServerErrorRequest('Error getting issues.');
  }
};

exports.getIssueById = async issueId => {
  try {
    const issue = await getIssueById(issueId);
    if (issue) {
      return [
        StatusCodes.OK,
        { message: `Successful fetch for issue ${issueId}.`, issue }
      ];
    }
    return badRequest(`No issue found with id provided.`);
  } catch (err) {
    logger.error('Error getting issue by id ', err);
    return internalServerErrorRequest('Error getting issue by id.');
  }
};

exports.createIssue = async archive => {
  try {
    const {
      title,
      key,
      description,
      issuePath,
      issueType,
      coverImagePath,
      coverImageType,
      issueSize,
      coverImageSize
    } = archive;
    if (!issuePath) {
      return badRequest('Issue must be provided to upload.');
    }
    if (issuePath && !ISSUE_MIME_TYPES.includes(issueType)) {
      return badRequest('Issue must be a binary file.');
    }
    if (issuePath && issueSize <= 0) {
      return badRequest('Issue must be a file with actual data in it.');
    }
    if (!coverImagePath) {
      return badRequest('Cover image must be provided to upload.');
    }
    if (coverImagePath && !COVERIMAGE_MIME_TYPES.includes(coverImageType)) {
      return badRequest('File must be a file with a image extension.');
    }
    if (coverImagePath && coverImageSize <= 0) {
      return badRequest('Cover image must be a file with actual data in it.');
    }
    if (!title) {
      return badRequest('Must have file title associated with file upload.');
    }
    if (!description) {
      return badRequest('Description must be provided.');
    }
    const issue = await getIssueByTitle(title);
    if (issue) {
      return badRequest(
        `Issue with the title ${title} provide already exists.`
      );
    } else {
      const isIssueBucketAvaiable = await doesIssueS3BucketExist();
      const isCoverImageBucketAvaiable = await doesCoverImageS3BucketExist();
      if (!isIssueBucketAvaiable && !isCoverImageBucketAvaiable) {
        await createIssueS3Bucket();
        await createCoverImageS3Bucket();
      } else {
        const { issueLocation, coverImageLocation } =
          await uploadPdfArchiveToS3Location(archive);

        const issueOrder = await getNextIssueOrder();

        const body = {
          title,
          key,
          url: issueLocation,
          description,
          coverImage: coverImageLocation,
          issueOrder
        };
        await createIssue(body);
        return [
          StatusCodes.CREATED,
          { message: 'Issue uploaded to s3 with success', issue: { ...body } }
        ];
      }
    }
  } catch (err) {
    logger.error(`Error uploading issue to s3: `, err);
    return internalServerErrorRequest('Error uploading issue to s3.');
  }
};

exports.updateIssue = async archive => {
  try {
    const {
      title,
      description,
      issueId,
      issuePath,
      issueType,
      coverImagePath,
      coverImageType,
      paid,
      issueSize,
      coverImageSize,
      issueOrder
    } = archive;
    if (description && description.length > 255) {
      return badRequest(
        'Description must be provided and less than 255 characters long.'
      );
    }
    if (paid && typeof paid !== 'boolean') {
      return badRequest('Purchased flag must be provided and a boolean flag.');
    }

    const issue = await getIssueById(issueId);

    if (issue.issueOrder === issueOrder) {
      return badRequest(
        'Issue Order number provided already in use. Please provide another issue order number'
      );
    }

    if (issue) {
      const newKey = removeSpaces(title);
      if (newKey !== issue.key) {
        await copyIssueObject(issue.key, newKey);
        await copyCoverImageObject(issue.key, newKey);
        const url = getIssueDistributionURI(newKey);
        const coverImage = getCoverImageDistributionURI(newKey);
        const body = {
          title,
          issueId,
          key: newKey,
          description,
          coverImage,
          url,
          paid,
          issueOrder
        };
        await updateIssue(body);
        deleteIssueByKey(issue.key);
        deleteCoverImageByKey(issue.key);
        return [
          StatusCodes.OK,
          {
            message: 'Issue updated in s3 with success',
            issue: {
              ...body
            }
          }
        ];
      }
      if (issuePath && issueSize > 0) {
        if (!ISSUE_MIME_TYPES.includes(issueType)) {
          return badRequest('File must be a file with a pdf extention.');
        }
        const isIssueBucketAvaiable = await doesIssueS3BucketExist();
        if (isIssueBucketAvaiable) {
          const s3Object = await doesIssueObjectExist(newKey);
          if (s3Object) {
            deleteIssueByKey(newKey);
          }
          const { issueLocation } = await uploadArchiveToS3Location(archive);
          const body = {
            title,
            issueId,
            key: newKey,
            description,
            url: issueLocation,
            paid,
            issueOrder
          };
          await updateIssue(body);
          return [
            StatusCodes.OK,
            {
              message: 'Issue uploaded to s3 with success',
              issue: {
                ...body
              }
            }
          ];
        }
      }
      if (coverImagePath && coverImageSize > 0) {
        if (!COVERIMAGE_MIME_TYPES.includes(coverImageType)) {
          return badRequest('File must be a file with a image extention.');
        }
        const isCoverImageBucketAvaiable = await doesCoverImageS3BucketExist();
        if (isCoverImageBucketAvaiable) {
          const s3Object = await doesCoverImageObjectExist(newKey);
          if (s3Object) {
            deleteCoverImageByKey(newKey);
          }
          const { coverImageLocation } = await uploadArchiveToS3Location(
            archive
          );

          const body = {
            title,
            issueId,
            key: newKey,
            description,
            coverImage: coverImageLocation,
            paid,
            issueOrder
          };
          await updateIssue(body);
          return [
            StatusCodes.OK,
            {
              message: 'Cover image uploaded to s3 with success',
              issue: {
                ...body
              }
            }
          ];
        }
      } else {
        const url = await getIssueDistributionURI(newKey);
        const coverImage = await getCoverImageDistributionURI(newKey);
        const body = {
          title,
          issueId,
          url,
          description,
          coverImage,
          paid,
          issueOrder
        };
        await updateIssue(body);
        return [
          StatusCodes.OK,
          {
            message: 'Issue updated with success.',
            issue: {
              ...body
            }
          }
        ];
      }
    } else {
      return badRequest(`No issue was found for issueId passed.`);
    }
  } catch (err) {
    logger.error(`Error updating issue metadata: `, err);
    return internalServerErrorRequest('Error updating issue metadata.');
  }
};

exports.updateViews = async issueId => {
  try {
    const issueViews = await updateIssueViews(issueId);
    if (issueViews) {
      return [
        StatusCodes.OK,
        {
          message: `issueId: ${issueId} has ${issueViews} views.`,
          views: issueViews
        }
      ];
    }
    return badRequest(`No issues found to update clicks.`);
  } catch (err) {
    logger.error('Error updating views on issue: ', err);
    return internalServerErrorRequest('Error updating views.');
  }
};

exports.deleteIssueById = async issueId => {
  try {
    const issue = await getIssueById(issueId);
    if (issue) {
      const { key } = issue;
      deleteIssueByKey(key);
      deleteCoverImageByKey(key);
      const deletedIssue = await deleteIssueById(issueId);
      if (deletedIssue) {
        return [StatusCodes.NO_CONTENT];
      }
    }
    return badRequest(`No issue found with id provided.`);
  } catch (err) {
    logger.error('Error deleting issue by id: ', err);
    return internalServerErrorRequest('Error deleting issue by id.');
  }
};

exports.getTotal = async query => {
  try {
    const issues = await getTotal(query);
    if (issues) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch for get total video with query params.',
          total_issue: issues
        }
      ];
    }
    return badRequest(`No issue found with selected query params.`);
  } catch (err) {
    logger.error('Error getting all issues: ', err);
    return internalServerErrorRequest('Error getting issues.');
  }
};

exports.getNextIssueOrder = async () => {
  try {
    const nextIssueOrder = await getNextIssueOrder();
    if (nextIssueOrder) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch of next issue order number.',
          nextIssueOrder
        }
      ];
    }
    return badRequest(`Unable to compute next largest issue order number.`);
  } catch (err) {
    logger.error('Error computing next largest issue order number: ', err);
    return internalServerErrorRequest(
      'Error computing next largest issue order number.'
    );
  }
};
