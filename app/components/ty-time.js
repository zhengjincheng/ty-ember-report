import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement(){
		console.log("--ty-time-didInsertElement----");
		$("#reportTimePlugin").TyChoiceDatePicker();
		//todo
		$("#activeDevice").rumchart();
		$("#httpResponseTime").rumchart();
		$("#topWebAction").rumchart();
		$("#error").rumchart();
		$("#httpAndNetwork").rumchart();
		$("#throughput").rumchart();
		$("#apdex").rumchart();
	}
});
