# This script should be used for local test builds, or for builds intended for local use.
# First Step (load env):
# A small but script for loading environment variables into the current shell process at runtime. More: ./load_dotenv --help
# define the variables $NEXT_PUBLIC_URL and $IMAGE_REGISTRY in the .env.local

chmod +x "load_dotenv"
eval "$(./load_dotenv .env.local)"

# Second Step (build image):
DOCKER_BUILDKIT=1 docker build --rm --platform linux/amd64 -t test3 .

# next blocks the nodejs interpreter at build time and we cannot build two images
# in parallel with one buildx builder. If you want to build arm64v8 comment this line,
# or you can specify any other platform

#docker buildx build -build-arg NEXT_PUBLIC_URL="$NEXT_PUBLIC_URL" --platform linux/arm64v8  --tag "$IMAGE_REGISTRY/cxm-shipping:test" --push .

DOCKER_BUILDKIT=1 docker run -p 0.0.0.0:3000:3000 --env-file .env.local --privileged --rm test3