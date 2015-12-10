"use strict";

var config = require('./config.js');
var couchbase = require("couchbase");

var connpathMain = config.couchbaseMain.connpath;
var connpathSecondary = config.couchbaseSecondary.connpath;
console.log("Connect path created...");
var clusterMain = new couchbase.Cluster(connpathMain);
var clusterSecondary = new couchbase.Cluster(connpathSecondary);
console.log("Clusters created...");
var bucketMainName = config.couchbaseMain.pocketPractice.bucketName;
var bucketSecondaryName = config.couchbaseSecondary.secondary.bucketName;

var secondaryBucket = clusterSecondary.openBucket(bucketSecondaryName);
console.log("Buckets selected...");
var viewGroupMain = config.couchbaseMain.pocketPractice.viewGroup;
var viewNameMain = config.couchbaseMain.pocketPractice.viewName;
console.log("View selected...");
var ViewQueryFull = couchbase.ViewQuery.from(viewGroupMain, viewNameMain);
console.log("Getting view...");
var count = 0;
var timeStart = Date.now();

//Final. Summ of time
function printTime(first, second, count){
	var result = second - first;
	console.log("Fetched and succesfully updated: "+count+" documents. Time remaining: "+result/1000+'seconds');
	process.exit();
}

// override all documents.
function upsertRow(key, value, allCount){
	return secondaryBucket.upsert(key, value, function(err, result){
		if (err) throw err;
		else
		{
			count++;
			var timeFinish = Date.now();
			if (count==allCount){ printTime(timeStart, timeFinish, count); }	
		} 

	});
}

//select a view. 
var mainBucket = clusterMain.openBucket(bucketMainName);
console.log("It's can takes a hour or more...");
var query = mainBucket.query(ViewQueryFull, function(err, result){
	if (err) throw err;
	else 
	{
		console.log("Start updating...");
		for (var i=0; i<result.length; i++)
		{
			var key = result[i].key;
			var value = result[i].value;	
			upsertRow(key, value, result.length);	
		}
	}
});

