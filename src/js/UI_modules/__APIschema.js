var UI_APIschema = function (DOMelement) {
	var __self = this;

	__self.el        = DOMelement;
	__self.templates = {};
	__self.endpoints = [];

	__self.objectType    = __self.el.querySelectorAll("[data-js~='objectType']");
	__self.objectOptions = __self.el.querySelectorAll("[data-js~='objectOptions']");

	__self.initialize();
};

UI_APIschema.prototype.initialize = function() {
	var __self = this;

	var removeContentItem = function (e) {
		for ( var element = e.target; element; element = element.parentElement ) {
			if ( element.className.indexOf("code-object-content-item") > -1 ) {
				element.remove();
				return;
			}
		}
	};
	var removeParentContentItem = function (e) {
		var isParent = false;
		for ( var element = e.target; element; element = element.parentElement ) {
			if ( element.className.indexOf("code-object-content-item") > -1 ) {
				if ( isParent ) {
					element.remove();
					isParent = false;
					return;
				}
				isParent = true;
			}
		}
	};
	__self.el.addEventListener("click", function (e) {
		if ( e.target.getAttribute("data-js") !== null && e.target.getAttribute("data-js").indexOf("removeItem") > -1 ) {
			removeContentItem(e);
		}
	});

	var updateContentItem = function (e) {
		var select,toUpdate,toUpdateIn,toUpdateHTML;
		select     = e.currentTarget;
		toUpdate   = select.value;
		toUpdateIn = select.parentElement.parentElement.parentElement;

		if ( toUpdate === "delete" ) {
			removeParentContentItem(e);
		} else {
			if ( toUpdate === "object" || toUpdate === "array" ) {
				toUpdateHTML = __self.createObjectHTML(toUpdate);
			} else if ( toUpdate === "generated field" ) {
				toUpdateHTML = __self.createFieldHTML("generate");
			} else if ( toUpdate === "sampled field" ) {
				toUpdateHTML = __self.createFieldHTML("sample");
			} else if ( toUpdate === "custom field" ) {
				toUpdateHTML = __self.createFieldHTML("custom");
			}
		}

		toUpdateIn.insertAdjacentHTML( "beforeend", toUpdateHTML );
		toUpdateIn.querySelector('.code-object-content-item:last-child').querySelector('[data-js~="objectOptions"]').addEventListener("change", updateContentItem);
		select.options[0].selected = true;
	};


	for ( var schemaOption = 0, totalOptions = __self.objectOptions.length; schemaOption < totalOptions; schemaOption++ ) {
		var currentOption = __self.objectOptions[schemaOption];
		currentOption.addEventListener("change", updateContentItem);
	}
};

UI_APIschema.prototype.addTemplate = function () {

};
UI_APIschema.prototype.updateTemplate = function () {

};
UI_APIschema.prototype.addSchema = function (schemaName,schemaExt,URL_BASE,queryable,schemaMethods,schemaContent) {
	var __self,schema;
	__self = this;

	schema = {
		"name"      : schemaName,
		"ext"       : schemaExt,
		"URL_BASE"  : URL_BASE,
		"queryable" : queryable,
		"methods"   : schemaMethods,
		"content"   : schemaContent
	};

	__self.endpoints.push(schema);
};
UI_APIschema.prototype.updateSchema = function () {

};


UI_APIschema.prototype.createObjectHTML = function (objectType) {
	var __self,objectTemplate;
	__self         = this;
	objectTemplate = '<li class="code-object-content-item">' +
					'<div class="code-object" data-ui-settings="type__' + objectType + '">' +
					'<input class="code-object-input" id="records" type="checkbox" checked="">' +
					'<label class="code-object-toggler" for="records"></label>' +
					'<span class="code-object-name" contenteditable="true">"name"</span>' +
					((objectType === "array") ? '<span class="code-object-amount" contenteditable="true">1</span>': "")  +
					'<ul class="code-object-content">' +
						'<li class="code-object-content-item">' +
							'<div class="code-options">' +
								'<select class="code-options-list">' +
									'<option value="">type</option>' +
									'<option value="array"' + ((objectType === "array") ? "selected" : "") + '>array</option>' +
									'<option value="object"' + ((objectType === "object") ? "selected" : "") + '>object</option>' +
								'</select>' +
							'</div>' +
							'<div class="code-options">' +
								'<select class="code-options-list" data-js="objectOptions">' +
									'<option value="">options</option>' +
									'<optgroup label="ADD">' +
										'<option value="array">array</option>' +
										'<option value="object">object</option>' +
										'<option value="generated field">field: generated</option>' +
										'<option value="sampled field">field: sampled</option>' +
										'<option value="custom field">field: custom</option>' +
										'<option value="string">string</option>' +
										'<option value="number">number</option>' +
									'</optgroup><optgroup label="Other">' +
										'<option value="delete">delete</option>' +
										'<option value="number">create template</option>' +
								'</optgroup></select>' +
							'</div>' +
						'</li>' +
					'</ul>' +
				'</li>';
	return objectTemplate;
};

UI_APIschema.prototype.createFieldHTML = function (fieldType) {
	var __self,editable,generateValue,sampleValue,field,fieldTemplate;
	__self = this;

	editable      = 'contenteditable="true"';
	generateValue ='<div class="code-options">' +
						'<select class="code-options-list" data-js="generatedValue">' +
							'<option value="">generated values</option>' +
						'</select>' +
					'</div>';
	sampleValue = '<div class="code-options">' +
						'<select class="code-options-list" data-js="sampledValue">' +
							'<option value="">sampled values</option>' +
						'</select>' +
					'</div>';
	field = {
		generate : 	{
			key   : 'generated key/value', 
			value : generateValue
		},
		sample : {
			key   : 'custom key', 
			value : sampleValue
		},
		custom : {
			key   : 'custom key',
			value : 'custom value' 
		}
	};

	fieldTemplate = '<li class="code-object-content-item">' +
		'<span class="code-key"' + ((fieldType === "generate") ? "" : editable) + '>' + field[fieldType]["key"] + '</span>' +
		'<span class="code-value" contenteditable=' + ((fieldType === "custom") ? editable : "") + '>' + field[fieldType]["value"] + '</span>' +
		'<span class="code-remove" data-js="removeItem"></span>' +
	'</li>';
	return fieldTemplate;
};




