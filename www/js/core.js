var app = {

    findByName: function() {
        console.log('findByName');
    },

    initialize: function() {
        this.store = new WebSqlStore();
        initApp();
        //$('.search-key').on('keyup', $.proxy(this.findByName, this));
    }

};

function alert(text) {
	$('.alert span.message').html(text);
	$('.alert').show();
}

app.initialize();