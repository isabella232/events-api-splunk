import React, { useState } from "react";

import { VERSION, HOST, onepassword_name_space } from "../views/setup_page";

const e = React.createElement;

export const SetupWizard = (props) => {
  const steps = [
    {
      description: e("span", null, [
        "To get started, you'll need to generate an Events API token.",
        e("br"),
        e("br"),
        'Click "Generate an Events API token", sign in to your account on',
        e("br"),
        "1Password.com, then follow the onscreen instructions.",
        e("br"),
        e("br"),
        "After you get your token, come back here to enter it.",
      ]),
    },
    {
      description: "Enter the token you got from 1Password.com:",
    },
  ];

  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState({ success: false, error: "" });
  const [authToken, setAuthToken] = useState("");

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSkip = () => {
    setCurrentStep(totalSteps);
  };

  const handleSubmit = async () => {
    const result = await props.handleSubmit(authToken);
    setResult(result);
  };

  // currentStep is using one-based indexing
  const stepDetails = steps[currentStep - 1];

  return e("div", { className: "container" }, [
    e("div", { className: "main-contents" }, [
      e("div", { className: "version block" }, [`Version ${VERSION}`]),
      e(
        "div",
        { className: "title" },
        e("h1", { className: "block" }, "1Password Events Reporting for Splunk")
      ),
      e("div", { className: "content" }, [
        e(
          "div",
          { className: "description" },
          e("div", { className: "block" }, stepDetails.description)
        ),
        currentStep == 1 &&
          (!result.success || result.error) &&
          e(
            "div",
            { className: "warning block" },
            "Your other Splunk apps or add-ons may be able to access your Events API token. Make sure you trust them before you add your token."
          ),
        currentStep == 1 &&
          e(
            "a",
            {
              target: "_blank",
              href: `https://start.${HOST}/signin?landing-page=%2Fintegrations%2Fevents_reporting%2Fcreate%3Ftype%3Dsplunk%26name%3D${location.hostname}`,
            },
            e("button", { className: "generate", onClick: handleNext }, [
              e("img", {
                className: "plus",
                src: "/static/app/onepassword_events_api/img/plus.svg",
              }),
              "Generate an Events API token",
            ])
          ),
        currentStep === totalSteps &&
          e("div", { className: "token block" }, [
            e("input", {
              type: "text",
              placeholder: "Events API Token",
              value: authToken,
              onChange: (e) => setAuthToken(e.target.value),
            }),
            result.success
              ? e("button", { className: "btn", disabled: true }, "Token Saved")
              : e(
                  "button",
                  {
                    className: "submit",
                    onClick: handleSubmit,
                  },
                  "Submit"
                ),
          ]),
        result.error && e("div", { className: "error block" }, result.error),
        result.success &&
          e("div", { className: "success block" }, [
            "Your token has been added. Next, you'll need to configure the index and scripted input for the add-on.",
            e("br"),
            e("br"),
            "If this is the first time you're setting it up, ",
            e(
              "a",
              {
                target: "_blank",
                href:
                  "https://support.1password.com/events-reporting-splunk/#step-3-set-up-the-1password-events-api-add-on",
              },
              "learn how to setup the 1Password Events API add-on."
            ),
            e("br"),
            e("br"),
            "If you're changing the token for an existing add-on, you'll need to ",
            e(
              "a",
              {
                target: "_blank",
                href:
                  "https://support.1password.com/events-reporting-splunk/#configure-the-scripted-input",
              },
              "turn off the scripted input for the index, then turn it back on."
            ),
          ]),
      ]),
      e("div", { className: "controls block" }, [
        e(
          "a",
          { onClick: handleSkip },
          currentStep === 1 && "I already have my Events API token"
        ),
        e("div", { className: "controls-buttons" }, [
          e(
            "a",
            {
              href: `/app/${onepassword_name_space.app}`,
            },
            e(
              "button",
              {
                className: result.success ? "next btn" : "btn",
                disabled: !result.success,
              },
              "Finish"
            )
          ),
        ]),
      ]),
    ]),
  ]);
};
