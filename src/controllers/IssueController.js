'use strict';

import logger from '../logger';
import { IssueService } from '../services';

exports.getIssues = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await IssueService.getIssues(query);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting issues: `, err);
    next(err);
  }
};

exports.getIssueById = async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const [statusCode, response] = await IssueService.getIssueById(issueId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting an issue: `, err);
    next(err);
  }
};

exports.createIssue = async (req, res, next) => {
  try {
    const payload = await IssueService.getPayloadFromFormRequest(req);
    const [statusCode, response] = await IssueService.createIssue(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with creating issue: `, err);
    next(err);
  }
};

exports.updateIssue = async (req, res, next) => {
  try {
    const payload = await IssueService.getPayloadFromFormRequest(req);
    const [statusCode, response] = await IssueService.updateIssue(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating issue: `, err);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { issueId } = req.body;
    const [statusCode, payload] = await IssueService.updateViews(issueId);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with updating views for issue: `, err);
    next(err);
  }
};

exports.deleteIssueById = async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const [statusCode] = await IssueService.deleteIssueById(issueId);
    res.status(statusCode).end();
  } catch (err) {
    logger.error(`Error with deleteing an issue: `, err);
    next(err);
  }
};

exports.getTotal = async (req, res, next) => {
  try {
    const [statusCode, response] = await IssueService.getTotal();
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting issues: `, err);
    next(err);
  }
};

exports.getNextIssueOrder = async (req, res, next) => {
  try {
    const [statusCode, response] = await IssueService.getNextIssueOrder();
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting largest issue number: `, err);
    next(err);
  }
};
