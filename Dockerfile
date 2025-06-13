FROM node:22-slim@sha256:048ed02c5fd52e86fda6fbd2f6a76cf0d4492fd6c6fee9e2c463ed5108da0e34

LABEL repository="https://github.com/junobuild/juno-action"
LABEL homepage="https://juno.build"
LABEL maintainer="David Dal Busco <david.dalbusco@outlook.com>"

LABEL com.github.actions.name="GitHub Action for Juno"
LABEL com.github.actions.description="Enable arbitrary actions with the Juno CLI."
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="purple"

ENV TZ=UTC

# Install required tools
RUN DEBIAN_FRONTEND=noninteractive apt update && apt install -y \
    bash \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Juno's CLI
RUN npm i -g @junobuild/cli@0.4.0

# Install pnpm which is not part of the default image
RUN npm i -g pnpm@10.12.1

# Create and use a user instead of using root
RUN useradd -ms /bin/bash apprunner
USER apprunner

# Define working directories
WORKDIR /juno

# Environment variables where files are downloaded and executed
ENV TARGET_DIR=/juno/target
RUN echo "export TARGET_DIR=${TARGET_DIR}" >> ./.bashrc

# Environment variables for using the Juno source repo
ENV JUNO_MAIN_DIR=${TARGET_DIR}/juno-main
RUN echo "export JUNO_MAIN_DIR=${JUNO_MAIN_DIR}" >> ./.bashrc

# Copy list of resources to download
COPY --chown=apprunner:apprunner ./docker/download ./docker/download

# Download required artifacts and sources
RUN ./docker/download/init

# Install Rust and Cargo in apprunner home
ENV RUSTUP_HOME=/home/apprunner/.rustup \
    CARGO_HOME=/home/apprunner/.cargo \
    PATH=/home/apprunner/.cargo/bin:$PATH

# Copy list of scripts to run setup
COPY --chown=apprunner:apprunner ./docker/setup ./docker/setup

# Install tools for building WASM with the action
RUN ./docker/setup/bootstrap

# Copy docs and entrypoint
COPY --chown=apprunner:apprunner LICENSE README.md /
COPY --chown=apprunner:apprunner "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["--help"]