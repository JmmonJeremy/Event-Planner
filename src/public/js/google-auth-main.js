// Initialize Materialize components
M.Sidenav.init(document.querySelector('.sidenav'))
M.FormSelect.init(document.querySelector('#status'))

// Disable CKEditor notifications
CKEDITOR.on('instanceReady', function() {
    CKEDITOR.plugins.notification = CKEDITOR.plugins.notification || {};
    CKEDITOR.plugins.notification.prototype.show = function() { return false; };
});

const fields = ['plan', 'action', 'victory']; // Array of field IDs

// Initialize CKEditor for 'plan', 'action', & 'victory' field
fields.forEach(fieldId => {    
    CKEDITOR.replace(fieldId, {
        plugins: 'wysiwygarea, toolbar, basicstyles, format, stylescombo, find, link, image, font, colorbutton, colordialog, ' 
                +'justify, pastefromword, find, removeformat, copyformatting, undo, pagebreak, preview, print, save, table, ' 
                + 'tabletools, liststyle, specialchar, smiley, indentblock, blockquote, selectall, maximize',
        contentsCss: ['/css/google-auth-style.css'],
        bodyClass: 'ckeditor-body',  // Add a custom class to apply the specific styles
        on: {
            instanceReady: function(evt) {
                // Add the class to the editor's container when it's ready
                const editorElement = evt.editor.container;
                editorElement.addClass('editor-blue-border');
                evt.editor.document.getBody().setStyle('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif');
            }
        },
        //mediaembed,emoji,wordcount & anchor plugin is breaking it for some reason ? compatiblity issues embed doesn't show up
        //embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}', // iFrame.ly as an example provider for autoembed
        toolbar: [
            { name: 'clipboard', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'] },
            { name: 'editing', items: ['Find', 'Replace', 'SelectAll', 'Scayt'] },
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting', 'Subscript', 'Superscript'] },              
            { name: 'tabletools', items: ['TableProperties', 'TableDelete', 'TableCell', 'TableRow', 'MergeCells'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv'] },
            { name: 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
            { name: 'colors', items: ['TextColor', 'BGColor'] },           
            { name: 'document', items: ['Source', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
            { name: 'view', items: ['Maximize'] },                 
            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },                      
        ],            
        removeButtons: 'Subscript,Superscript', // Remove buttons you don't need *needed to see Underline symbol                
    });
});

// Empty the year value if the date is not entered
document.getElementById('goalCreationForm').addEventListener('submit', function(event) {
    const month = document.getElementById('month')?.value;
    const day = document.getElementById('day')?.value;
    const yearInput = document.getElementById('year');
    
    // Clear the year if month or day is blank
    if (!month || !day) {
        yearInput.value = '';
    }
});
