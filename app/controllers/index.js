module.exports.controller = function(app) {
	app.get('/', function(req, res) {
		console.log('hey');
		res.render('index');
	});
}
