export const FooterNewsletter = (props: {
  buttonText: string
  formId: string
  noteTitle?: string
}) => {
  const { formId, buttonText, noteTitle } = props
  return (
    <div className="cta-form">
      <script src="https://f.convertkit.com/ckjs/ck.5.js"></script>
      {/* //allow for captcha by removing data-sv-form={formId} */}
      <form
        action={`https://app.convertkit.com/forms/${formId}/subscriptions?utm_source=quartz_blog&utm_medium=essay_cta&utm_campaign=na&utm_content=${noteTitle}`}
        class="seva-form formkit-form"
        method="post"
        data-uid="439e8b14a6"
        data-format="inline"
        data-version="5"
        data-options={`{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"fathom":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://convertkit.com/features/forms?lmref=6rqijg&amp;utm_campaign=poweredby&amp;utm_content=${noteTitle}&amp;utm_medium=essay_cta&amp;utm_source=quartz_blog"},"recaptcha":{"enabled":false},"return_visitor":{"action":"show","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}`}
        min-width="400 500 600 700 800"
      >
        {/* I removed data-style=clean */}
        <div>
          <ul
            class="formkit-alert formkit-alert-error"
            data-element="errors"
            data-group="alert"
          ></ul>
          {/* I removed data-stacked */}
          <div data-element="fields" class="seva-fields formkit-fields">
            <div class="formkit-field">
              <input
                class="formkit-input"
                name="email_address"
                aria-label="Email Address"
                placeholder="Email Address"
                required={true}
                type="email"
                style="color: rgb(0, 0, 0); border-color: rgb(227, 227, 227); border-radius: 4px; font-weight: 400;"
              />
            </div>
            <button data-element="submit" class="formkit-submit">
              <div class="formkit-spinner">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span class="">e{buttonText}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
