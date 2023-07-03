# This script should be used for local test builds, or for builds intended for local use.

# Second Step (build image):
DOCKER_BUILDKIT=1 docker build  --platform linux/amd64 -t shipping-test .


# If you want to build arm64v8 comment this line,
# or you can specify any other platform

#docker buildx build -build-arg NEXT_PUBLIC_URL="$NEXT_PUBLIC_URL" --platform linux/arm64v8  --tag "$IMAGE_REGISTRY/shipping-test:arm64v8" --push .

DOCKER_BUILDKIT=1 docker run -p 0.0.0.0:3000:3000 --env-file .env --rm shipping-test
