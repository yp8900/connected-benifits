#!/bin/sh

if [ ! -f /app/package.json ]; then
  echo "*****************************************************************"
  echo "WARNING: no application found in the /app directory"
  echo "         Did you forget to mount the host filesystem?"
  echo "*****************************************************************"
fi

# if we're running this entrypoint against a DEV stage container, we expect
# /app and /app/node_modules to be separate mounts from the host filesystem.
if mount | grep "/app[^/]" > /dev/null; then
  echo "Detected /app as a separate mount - assuming running againt DEV stage";
  if [ -d /app/node_modules ] && ! mount | grep "/app/node_modules" > /dev/null; then
    echo "*****************************************************************"
    echo "WARNING: /app/node_modules does not appear to be a separate volume mount"
    echo "         The application may encounter issues with platform specific"
    echo "         NPM modules if the host's node_modules/ directory is used"
    echo "*****************************************************************"
  elif [ -d /app_cache/node_modules ] && [ -d /app/node_modules ]; then
    echo "Linking node_modules from /app_cache to /app/node_modules"
    ln -fs /app_cache/node_modules/* /app/node_modules/
    ln -fs /app_cache/node_modules/.* /app/node_modules/ 2>/dev/null
  fi
fi

if [ -f /app/package.json ] && [ "${PWD}" == "/app" ]; then
  npm install
  echo "Running migrations..."
  npm run migrate:up
fi

echo "Running \"$@\""
exec "$@"