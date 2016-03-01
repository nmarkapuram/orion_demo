/**
 * jQuery File Upload User Interface Plugin 9.5.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global define, window */

(function (factory) {
    'use strict';
        // Browser globals:
        factory(
            window.jQuery,
            window.tmpl
        );
}(function ($, tmpl) {
    'use strict';

    $.blueimp.fileupload.prototype._specialOptions.push(
        'filesClosestContainer',
		'fileInputs'
    );

    // The UI version extends the file upload widget
    // and adds complete user interface interaction:
    $.widget('blueimp.fileupload', $.blueimp.fileupload, {

        options: {
            // The parent container for the list of files. If undefined, it is set to
            // an element with class "filesCloser" inside of the widget element:
            filesClosestContainer: undefined,
			singleRequest: false,
			fileInputs: undefined,		
			forceSubmit: false,
			maxNumberOfFilesForInstance: 0,
			replaceFiles: false,
			// The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop or add API call).
            // See the basic file upload widget for more information:
            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var $this = $(this),
                    that = $this.data('blueimp-fileupload') ||
                        $this.data('fileupload'),
                    options = that.options;
					
				if(data.closestFilesContanier.length<1){
						data.closestFilesContanier = options.filesContanier
				}
				if(options.replaceFiles){
					data.closestFilesContanier.find(".template-upload").remove();
				}
				if(options.maxNumberOfFilesForInstance && parseInt(options.maxNumberOfFilesForInstance,10) && data.closestFilesContanier.find(".template-upload").length>=parseInt(options.maxNumberOfFilesForInstance,10)){
					return false;
				}
				
                data.context = that._renderUpload(data.files)
                    .data('data', data)
                    .addClass('processing');
                data.closestFilesContanier[
                    options.prependFiles ? 'prepend' : 'append'
                ](data.context);
                that._forceReflow(data.context);
                that._transition(data.context);
                data.process(function () {
                    return $this.fileupload('process', data);
                }).always(function () {
                    data.context.each(function (index) {
                        $(this).find('.size').text(
                            that._formatFileSize(data.files[index].size)
                        );
                    }).removeClass('processing');
                    that._renderPreviews(data);
                }).done(function () {
                    data.context.find('.start').prop('disabled', false).removeClass("hasError");;
                    if ((that._trigger('added', e, data) !== false) &&
                            (options.autoUpload || data.autoUpload) &&
                            data.autoUpload !== false) {
                        data.submit();
                    }
                }).fail(function () {
                    if (data.files.error) {
                        data.context.each(function (index) {
                            var error = data.files[index].error;
                            if (error) {
                                $(this).find('.error').text(error);
                            }
                        }).addClass("hasError");
                    }
                });
            }
			
		},
		
		
		
		_onChange: function (e) {
				var that = this,
                data = {
                    fileInput: $(e.target),
					closestFilesContanier: $(e.target).closest(this.options.filesClosestContainer).find(".files"),
                    form: $(e.target.form)
                };
				this._getFileInputFiles(data.fileInput).always(function (files) {
                data.files = files;
                if (that.options.replaceFileInput) {
                    that._replaceFileInput(data.fileInput);
                }
                if (that._trigger(
                        'change',
                        $.Event('change', {delegatedEvent: e}),
                        data
                    ) !== false) {
                    that._onAdd(e, data);
                }
            });
        },
		
		_submitHandler: function (e) {
			if (e.isDefaultPrevented()) {
                    return false;
            }
            e.preventDefault();
			var that = this,
			 templateUploads = this.options.form.find('.template-upload').not(".hasError"),data ={files:[],paramName:[],fileInput:[],context:[],originalFiles:[]};
			templateUploads.each(function(ind,templateUpload){
				//$.extend(data,$(templateUpload).data('data'));fileInput,files			
				var dataRef = $(templateUpload).data('data');
                for (var i = 0; i < dataRef.files.length; i++) {
				    data.files.push(dataRef.files[0]);
                    data.paramName.push(dataRef.paramName);
					data.fileInput.push(dataRef.fileInput);
					//data.context.push(dataRef.context.eq(0));
					data.originalFiles.push(dataRef.originalFiles);
                }
				
				
			});
			
			data.fileInput = $(data.fileInput).map (function () {return $(this).toArray(); } );
			var newData = $.extend({}, data);
			//newData.paramName=[data.paramName];
			newData.context = templateUploads;
			that._initResponseObject(newData);
			that._initProgressObject(newData);
			that._addConvenienceMethods(e, newData);
			that.options.fileInput = data.fileInput;
			if (newData && newData.files.length>0 && newData.submit) {
                newData.submit();
            } else if(this.options.forceSubmit){       
				
				//data.submit = true;
				data.jqXHR = this.jqXHR =
                        (this._trigger(
                            'submit',
                            $.Event('submit', {delegatedEvent: e}),
                            this
                        ) !== false);
				var options = $.extend({}, this.options, data);
				this._initFormSettings(options);
				options.formData = this.formData || options.form.serializeArray();
				options.formData = this._getFormData(options);
				options.url = this.url || options.url;
				var tempOptions = {
					url : options.url,
					type: options.type,
					data: options.formData
				}
				this._send.call(this, e, tempOptions);
			}
        },	

        _send : function(e,options){
			var that = this,
                jqXHR,
                aborted,
                slot,
                pipe,
                options = options;
			jqXHR = jqXHR || (
                        ((aborted || that._trigger(
                            'send',
                            $.Event('send', {delegatedEvent: e}),
                            options
                        ) === false)) ||  $.ajax(options)
                    ).done(function (result, textStatus, jqXHR) {
						options.result = result;
						options.textStatus = textStatus;
						options.jqXHR = jqXHR;
						that._trigger('done', null, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                        that._onAlways(
                            jqXHRorResult,
                            textStatus,
                            jqXHRorError,
                            options
                        );
                        that._sending -= 1;
                        that._active -= 1;
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (that._getDeferredState(nextSlot) === 'pending') {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                        if (that._active === 0) {
                            // The stop callback is triggered when all uploads have
                            // been completed, equivalent to the global ajaxStop event:
                            that._trigger('stop');
                        }
                    });
                    return jqXHR;               

		},
		
		_initEventHandlers: function () {
			if (this._isXHRUpload(this.options)) {
				this._on(this.options.dropZone, {
					dragover: this._onDragOver,
					drop: this._onDrop
				});
				this._on(this.options.pasteZone, {
					paste: this._onPaste
				});
			}
			if ($.support.fileInput) {
			    this.options.fileInputSelector = this.options.fileInputSelector?this.options.fileInputSelector:'input[type="file"]';
				var temp = {};
				temp["change "+this.options.fileInputSelector] = this._onChange;
				this._on(this.options.form, temp);
			}
			
			if(this.options.singleRequest){
				this._on(this.options.form, {
				'submit': this._submitHandler
				});
			}
			
			this._on(this.options.form, {
			'click .start': this._startHandler,
			'click .cancel': this._cancelHandler,
			'click .remove': this._removeHandler,
			'click .delete': this._deleteHandler
			});
			this._initButtonBarEventHandlers();	

		},
		
		_removeHandler: function (e) {
            e.preventDefault();
            $(e.currentTarget)
                    .closest('.template-upload,.template-download').remove();
           
        }
    });

}));
