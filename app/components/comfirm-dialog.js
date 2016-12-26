import Ember from 'ember';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';

export default ModalDialog.extend({
	
	actions: {
    cancel() {
     if  (!(typeof this.get('onCancel')==='undefined')){
			  		  this.get('onCancel')(this.get('token'));
		  }
    },
    ok() {
       if  (!(typeof this.get('onOk')==='undefined')){
			  		  this.get('onOk')(this.get('token'));
		  }
    }
  }});