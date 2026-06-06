import dotenv from "dotenv";
dotenv.config();
import passport from "passport";

import { Strategy as GoogleStrategy }
from "passport-google-oauth20";

import { Strategy as GithubStrategy }
from "passport-github2";

import User from "../models/User.js";

passport.serializeUser(
  (user, done) => {
    done(null, user.id);
  }
);

passport.deserializeUser(
  async (id, done) => {
    try {
      const user =
        await User.findById(id);

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

// GOOGLE

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        "/api/auth/google/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        let user =
          await User.findOne({
            googleId: profile.id,
          });

        if (!user) {
          user = await User.create({
            googleId: profile.id,

            email:
              profile.emails?.[0]?.value,

            username:
              profile.displayName,

            avatar:
              profile.photos?.[0]?.value,

            provider: "google",
          });
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// GITHUB

passport.use(
  new GithubStrategy(
    {
      clientID:
        process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        "/api/auth/github/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        let user =
          await User.findOne({
            githubId: profile.id,
          });

        if (!user) {
          user = await User.create({
            githubId: profile.id,

            username:
              profile.username,

            avatar:
              profile.photos?.[0]?.value,

            provider: "github",
          });
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;