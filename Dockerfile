FROM node:22-slim

LABEL repository="https://github.com/junobuild/juno-action"
LABEL homepage="https://juno.build"
LABEL maintainer="David Dal Busco <david.dalbusco@outlook.com>"

LABEL com.github.actions.name="GitHub Action for Juno"
LABEL com.github.actions.description="Enable arbitrary actions with the Juno CLI."
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="purple"

RUN npm i -g @junobuild/cli@0.4.0 && npm cache clean --force;

RUN npm i -g pnpm@latest-10 && npm cache clean --force;

COPY LICENSE README.md /
COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["--help"]