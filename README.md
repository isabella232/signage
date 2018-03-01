# Digital Signage 2.0

![Codeship](https://codeship.com/projects/d35abc40-275e-0133-fc89-7af7072ae828/status?branch=master)

This application manages digital signage across the Chapman University campus. Sign owners can build and manage signs through the admin interface. Screens on campus display signs by opening a browser pointed at the appropriate `SignsController#play` endpoint.

The monitors and virtual machines powering them are administered by IS&T.

### Installation
Signage requires PostgreSQL as its datastore. See [Brew install guide here](http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/).

You'll also need to install ImageMagick. Mac instructions can be found [here](http://stackoverflow.com/questions/29377651/rails-error-imagemagick-graphicsmagick-is-not-installed).

```
git clone https://github.com/chapmanu/signage.git
cd signage
bundle install

# This file is needed for tests (and dev?). Ask a team member for the environment variables.
touch .env

# Get databases
rake db:setup

# Clone production data
cap production db:clone
```

#### Emergency Alerts

By default, this application is configured to monitor the Chapman University Public Safety feed and overlay all signs with a red emergency screen in the event the feed reports an emergency.

Unless you are displaying signs for Chapman University, you will probably want to disable this. To do so, update the following setting in `config/application.rb` to `nil`:

    config.x.public_safety.feed = nil

### Development
#### Tests

All tests:

    bundle exec rake test

Single test:

    bundle exec rake test test/models/sign_test.rb

#### Local Server

To start the the local server on port 3000:

    bundle exec rails server -b 0.0.0.0 -p 3000

Then head over to [localhost:3000](http://localhost:3000).


### Deployment

Deployment is handled by [Capistrano](http://capistranorb.com/). For staging, the default branch that will be deployed is the currently checked out branch. You can also specify a different branch in the deploy command:

    cap staging deploy BRANCH=my-feature-branch

For production, the `master` branch is deployed by default:

    cap production deploy

See team lead or Passpack for server authentication information.

- Production Server: signage.chapman.edu
- Staging Server: dev-signage.chapman.edu
