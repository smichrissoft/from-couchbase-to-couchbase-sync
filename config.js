module.exports = {
	couchbaseMain: {
    connpath:'http://main-syncro-server.domain:port',
    pocketPractice: {
      bucketName: 'pocket-practice',
      viewGroup: 'smichrissoft',
      viewName: 'getAllDocs'
    }
  },
  couchbaseSecondary: {
  	 connpath:'http://secondary-syncro-server.domain:port',
  	 secondary: {
  	  bucketName: 'secondary-bucket-name'
  	}
  }

};