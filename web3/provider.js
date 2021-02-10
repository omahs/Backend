module.exports = async function (app) {
	var net = require('net');
	var Web3 = require('web3');

	var options = {
		  reconnect: {
			auto: true
		  }
	};


	app.web3 = new Web3(new Web3.providers.WebsocketProvider(app.config.web3Url,options));
	app.web3Inf  = new Web3(new Web3.providers.WebsocketProvider(app.config.web3UrlInf,options));
	app.web3Bep20  = new Web3(new Web3.providers.WebsocketProvider(app.config.web3UrlBep20,options));


	app.web3.transactionPollingTimeout = 600;
	app.web3.transactionConfirmationBlocks = 1;

	return app;
}
