deploy/sandbox:
ifndef SANDBOX
	$(error SANDBOX is not set. usage: make deploy/sandbox SANDBOX=your_sandbox)
endif
	NODE_ENV=production npm run build
	@GIT_STATUS=`git status --porcelain` \
	GIT_BRANCH=`git branch | grep '^*' | cut -c3-` \
	ENVIRONMENT='sandbox' \
	node deploy.js

deploy/staging:
	NODE_ENV=production npm run build
	@GIT_STATUS=`git status --porcelain` \
	GIT_BRANCH=`git branch | grep '^*' | cut -c3-` \
	ENVIRONMENT='staging' \
	node deploy.js

deploy/latest:
	NODE_ENV=production npm run build
	@GIT_STATUS=`git status --porcelain` \
	GIT_BRANCH=`git branch | grep '^*' | cut -c3-` \
	ENVIRONMENT='latest' \
	node deploy.js

deploy/version:
ifndef VERSION
	$(error VERSION is not set. usage: make deploy/version VERSION=X.X.X)
endif
	NODE_ENV=production npm run build
	@GIT_STATUS=`git status --porcelain` \
	GIT_BRANCH=`git branch | grep '^*' | cut -c3-` \
	ENVIRONMENT='version' \
	node deploy.js