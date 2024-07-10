export const FooterNewsletter = (props: {buttonText: string, formId: string}) => {
  const {formId, buttonText} = props;
  return (
    <div className="cta-form">
      <script src="https://f.convertkit.com/ckjs/ck.5.js"></script>
      {/* //allow for captcha by removing data-sv-form={formId} */}
      <form action={`https://app.convertkit.com/forms/${formId}/subscriptions`} class="seva-form formkit-form" method="post" data-uid="439e8b14a6" data-format="inline" data-version="5" data-options="{&quot;settings&quot;:{&quot;after_subscribe&quot;:{&quot;action&quot;:&quot;message&quot;,&quot;success_message&quot;:&quot;Success! Now check your email to confirm your subscription.&quot;,&quot;redirect_url&quot;:&quot;&quot;},&quot;analytics&quot;:{&quot;google&quot;:null,&quot;fathom&quot;:null,&quot;facebook&quot;:null,&quot;segment&quot;:null,&quot;pinterest&quot;:null,&quot;sparkloop&quot;:null,&quot;googletagmanager&quot;:null},&quot;modal&quot;:{&quot;trigger&quot;:&quot;timer&quot;,&quot;scroll_percentage&quot;:null,&quot;timer&quot;:5,&quot;devices&quot;:&quot;all&quot;,&quot;show_once_every&quot;:15},&quot;powered_by&quot;:{&quot;show&quot;:true,&quot;url&quot;:&quot;https://convertkit.com/features/forms?lmref=6rqijg&amp;utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic&quot;},&quot;recaptcha&quot;:{&quot;enabled&quot;:false},&quot;return_visitor&quot;:{&quot;action&quot;:&quot;show&quot;,&quot;custom_content&quot;:&quot;&quot;},&quot;slide_in&quot;:{&quot;display_in&quot;:&quot;bottom_right&quot;,&quot;trigger&quot;:&quot;timer&quot;,&quot;scroll_percentage&quot;:null,&quot;timer&quot;:5,&quot;devices&quot;:&quot;all&quot;,&quot;show_once_every&quot;:15},&quot;sticky_bar&quot;:{&quot;display_in&quot;:&quot;top&quot;,&quot;trigger&quot;:&quot;timer&quot;,&quot;scroll_percentage&quot;:null,&quot;timer&quot;:5,&quot;devices&quot;:&quot;all&quot;,&quot;show_once_every&quot;:15}},&quot;version&quot;:&quot;5&quot;}" min-width="400 500 600 700 800">
          {/* I removed data-style=clean */}
          <div>
              <ul class="formkit-alert formkit-alert-error" data-element="errors" data-group="alert"></ul>
              {/* I removed data-stacked */}
              <div data-element="fields" class="seva-fields formkit-fields">
                  <div class="formkit-field"><input class="formkit-input" name="email_address" aria-label="Email Address" placeholder="Email Address" required={true} type="email" style="color: rgb(0, 0, 0); border-color: rgb(227, 227, 227); border-radius: 4px; font-weight: 400;"/></div>
                  <button data-element="submit" class="formkit-submit">
                      <div class="formkit-spinner">
                          <div></div>
                          <div></div>
                          <div></div>
                      </div>
                      <span class="">{buttonText}</span>
                  </button>
              </div>
          </div>
      </form>
    </div>
  )
}
