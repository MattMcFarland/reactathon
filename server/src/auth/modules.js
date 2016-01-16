const env = process.env.NODE_ENV || 'development';

// console.log(env);

export const config = require('../app.config.js').auth[env];

export const _ = require('lodash');
export const request = require('request');
export const passport = require('passport');
export const LocalStrategy = require('passport-local').Strategy;
export const crypto = require('crypto');
export const InstagramStrategy = require('passport-instagram').Strategy;
export const FacebookStrategy = require('passport-facebook').Strategy;
export const TwitterStrategy = require('passport-twitter').Strategy;
export const GitHubStrategy = require('passport-github').Strategy;
export const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
export const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
export const OpenIDStrategy = require('passport-openid').Strategy;
export const OAuthStrategy = require('passport-oauth').OAuthStrategy;
export const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
export const RedditStrategy = require('passport-reddit').Strategy;


