var App = {
	clientId: 'XXXXX', // Foursquare Client ID
	clientSecret: 'XXXXX', // Foursquare Client Secret
	categoryId: '4cce455aebf7b749d5e191f5', // Foursquare Category ID
	appId: 'XXXXX', // Facebook App ID
	init: function() {
		App.apiUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + App.clientId + '&client_secret=' + App.clientSecret + '&v=' + App.getDate() + '&';
		App.query = 'near=Stockholm,Sweden&limit=50&categoryId=' + App.categoryId;
		App.map = new google.maps.Map( document.getElementById('map'), {
			zoom: 11,
			center: new google.maps.LatLng(59.34531392739185,18.050021798828087),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		App.panel = $('#panel');
		App.template = $('#tmpl');
		App.createEvent = $('#create-event');
		App.load();
		
		$('.play').live('click', App.onPlay);
		$('.login').live('click', App.onLogin);
	},
	fbInit: function() {
		FB.init({
			appId: App.appId
		});
	},
	load: function() {
		$.getJSON( App.apiUrl + App.query, function(data){
			var items = data.response.venues;
			$.each(items, function() {
				var marker = new google.maps.Marker({
					map: App.map,
					position: new google.maps.LatLng( this.location.lat, this.location.lng ),
					data: this
				});
				google.maps.event.addListener( marker, 'click', App.onClick );
			});
		});
	},
	getDate: function() {
		var o = new Date(),
			m = o.getMonth() + 1,
			m = m < 10 ? '0' + m : m,
			d = o.getDate(),
			d = d < 10 ? '0' + d : d,
			y = o.getFullYear();
		
		return y + m + d;
	},
	onClick: function() {
		App.createEvent.hide();
		App.panel.empty().append( App.template.tmpl(this.data) );
	},
	onPlay: function(e) {
		e.preventDefault();
		
		App.createEvent.fadeIn();
	},
	onLogin: function(e) {
		e.preventDefault();
		
		FB.login(function(response) {
			App.createEvent.fadeOut();
		});
	}
};
$(document).ready(App.init);