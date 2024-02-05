FROM node:18.16.0-buster

LABEL repository="https://github.com/junobuild/juno-action"
LABEL homepage="https://juno.build"
LABEL maintainer="David Dal Busco <david.dalbusco@outlook.com>"

LABEL com.github.actions.name="GitHub Action for Juno"
LABEL com.github.actions.description="Enable arbitrary actions with the Juno CLI."
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="purple"

RUN apt update && apt-get install --no-install-recommends -y jq openjdk-11-jre && rm -rf /var/lib/apt/lists/*;

RUN npm i -g npm@9.6.1 && npm cache clean --force;
RUN npm i -g @junobuild/cli@0.0.46 && npm cache clean --force;

COPY LICENSE README.md /
COPY "entrypoint.sh" "/entrypoint.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["--help"]