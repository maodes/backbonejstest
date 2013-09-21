(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson',
			'click .edit' : 'editPerson',
			'click .delete' : 'deletePerson',
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
			
			this.listenTo(this.collection, 'add', this.createView);

			this.collection.fetch();

		},

		addPerson: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			this.collection.add(person);
			person.set("num", this.collection.length);

			
			var view = new PersonView({model: person});

			this.contacts_list.append(view.render().el);
		},

		createView : function(data){
			position = this.collection.indexOf(data)+1;
			data.set("position", position)
			var contactView = new PersonView({model: data});
			this.contacts_list.append(contactView.render().el)
		},
	});

	var PersonModel = Backbone.Model.extend({
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		initialize: function(){			
		},
		idAttribute : "_id"
	});

	

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http://localhost:9090/contacts',
		initialize: function () {
		}
	});

	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		initialize: function(contactData) {
			if(contactData.model.isNew()){
				var person = new PersonCollection();
				person.create(contactData.model);

			}
			else{
				contactData.model.save();
			}

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var contactApp = new App({collection: new PersonCollection()});



})(jQuery, Backbone, _)
