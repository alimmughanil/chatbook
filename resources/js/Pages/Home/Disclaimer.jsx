import HomeLayout from "@/Layouts/HomeLayout";

function Disclaimer(props) {
  const { appName, config } = props

  return (
    <HomeLayout title={props.title} auth={props.auth}>
      <div className="grid w-full md:place-content-center">
        <div className="w-full min-h-[70vh] xl:min-h-[50vh] sm:w-[50vw] bg-white border px-4 rounded-lg shadow py-4 mt-4 mb-16">
          {config ? (
            <div className="grid gap-2">
              <div dangerouslySetInnerHTML={{ __html: config?.description }} className="w-full"></div>
            </div>
          ) : (
            <div className="grid gap-2 text-justify">
              <h1 className="text-lg font-semibold text-center">
                Disclaimer for {appName}
              </h1>
              <p className="">
                If you require any more information or have any
                questions about our site's disclaimer, please feel
                free to contact us by email at
                mitrastrategy@gmail.com. Our Disclaimer was
                generated with the help of the{" "}
                <a href="https://www.disclaimergenerator.net/">
                  Free Disclaimer Generator
                </a>
                .
              </p>
              <p className="">
                All the information on this website -
                <span className="lowercase">https://{appName}/</span> - is published in good faith and
                for general information purpose only. {appName} does
                not make any warranties about the completeness,
                reliability and accuracy of this information. Any
                action you take upon the information you find on
                this website ({appName}), is strictly at your own risk.
                {appName} will not be liable for any losses and/or
                damages in connection with the use of our website.
              </p>
              <p className="">
                From our website, you can visit other websites by
                following hyperlinks to such external sites. While
                we strive to provide only quality links to useful
                and ethical websites, we have no control over the
                content and nature of these sites. These links to
                other websites do not imply a recommendation for all
                the content found on these sites. Site owners and
                content may change without notice and may occur
                before we have the opportunity to remove a link
                which may have gone 'bad'.
              </p>
              <p className="">
                Please be also aware that when you leave our
                website, other sites may have different privacy
                policies and terms which are beyond our control.
                Please be sure to check the Privacy Policies of
                these sites as well as their "Terms of Service"
                before engaging in any business or uploading any
                information.
              </p>
              <h2 className="text-lg font-semibold text-center">
                Consent
              </h2>
              <p className="">
                By using our website, you hereby consent to our
                disclaimer and agree to its terms.
              </p>
              <h2 className="text-lg font-semibold text-center">
                Update
              </h2>
              <p className="">
                Should we update, amend or make any changes to this
                document, those changes will be prominently posted
                here.
              </p>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default Disclaimer;
