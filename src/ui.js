orangee.render_template = function(target_id, template_id, json_data) {
  var template = jQuery(template_id).html();
  var rendered = Handlebars.compile(template)(json_data);
  jQuery(target_id).html(rendered);
};

orangee.scroller = IScroll;