#!/bin/sh

missingEnvVarMessage='%s environment variable is missing'

# check for required environment variables
[ -z "$NODE_ENV" ] && printf "$missingEnvVarMessage" "NODE_ENV" && exit 1
[ -z "$PORT" ] && printf "$missingEnvVarMessage" "PORT" && exit 1
[ -z "$MONGODB_URL" ] && printf "$missingEnvVarMessage" "MONGODB_URL" && exit 1

echo "Running \"$@\""
exec "$@"