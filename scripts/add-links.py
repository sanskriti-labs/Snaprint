import os

further_reading = {
    "print-kiosk-cost-india.mdx": """## Further reading

- [Is a Print Kiosk Profitable? ROI for Shop Owners](/blog/print-kiosk-profitability-roi) -- work out the payback for your location.
- [Print Kiosk Pricing Models Compared](/blog/print-kiosk-pricing-models-compared) -- how the one-time and monthly models stack up.
- [How to Set Up a Print Kiosk in India](/blog/how-to-setup-print-kiosk) -- the full setup walkthrough.""",

    "what-is-self-printing-kiosk.mdx": """## Further reading

- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- what you actually pay for a kiosk.
- [Is a Print Kiosk Profitable? ROI for Shop Owners](/blog/print-kiosk-profitability-roi) -- whether the numbers work.
- [Print Kiosks for Colleges](/blog/print-kiosk-for-colleges) -- the campus use case.
- [Print Kiosk for Offices](/blog/print-kiosk-for-offices) -- the workplace use case.
- [How to Set Up a Print Kiosk in India](/blog/how-to-setup-print-kiosk) -- the setup walkthrough.
- [Print Kiosk Pricing Models Compared](/blog/print-kiosk-pricing-models-compared) -- one-time vs monthly pricing.""",

    "print-kiosk-for-colleges.mdx": """## Further reading

- [How to Set Up a Print Kiosk in India](/blog/how-to-setup-print-kiosk) -- the full setup walkthrough.
- [Is a Print Kiosk Profitable? ROI for Shop Owners](/blog/print-kiosk-profitability-roi) -- whether the numbers work for your location.
- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- what a kiosk costs.""",

    "print-kiosk-for-offices.mdx": """## Further reading

- [How to Set Up a Print Kiosk in India](/blog/how-to-setup-print-kiosk) -- the full setup walkthrough.
- [What is a Self Printing Kiosk?](/blog/what-is-self-printing-kiosk) -- how the model works.
- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- what a kiosk costs.""",

    "print-kiosk-profitability-roi.mdx": """## Further reading

- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- the upfront cost behind the ROI calculation.
- [Print Kiosks for Colleges](/blog/print-kiosk-for-colleges) -- a high-volume location example.
- [Print Kiosk Pricing Models Compared](/blog/print-kiosk-pricing-models-compared) -- one-time vs monthly cost models.""",

    "how-to-setup-print-kiosk.mdx": """## Further reading

- [Print Kiosks for Colleges](/blog/print-kiosk-for-colleges) -- the campus location in detail.
- [Print Kiosk for Offices](/blog/print-kiosk-for-offices) -- the workplace location in detail.
- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- what hardware models cost.""",

    "print-kiosk-pricing-models-compared.mdx": """## Further reading

- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- the cost breakdown behind the pricing models.
- [Snaprint Franchise: Own an Unattended Print Kiosk in India](/blog/snaprint-franchise-print-kiosk-investment) -- the investment breakdown.""",

    "print-kiosk-franchise-vs-own-printer.mdx": """## Further reading

- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- what each model costs.
- [Snaprint Franchise: Own an Unattended Print Kiosk in India](/blog/snaprint-franchise-print-kiosk-investment) -- the investment breakdown.""",

    "print-kiosk-for-stationery-shops.mdx": """## Further reading

- [Print Kiosks for Colleges](/blog/print-kiosk-for-colleges) -- another high-footfall location type.
- [Is a Print Kiosk Profitable? ROI for Shop Owners](/blog/print-kiosk-profitability-roi) -- whether the numbers work.""",

    "print-kiosk-coworking-apartment-complexes.mdx": """## Further reading

- [Print Kiosk for Offices](/blog/print-kiosk-for-offices) -- the workplace location in detail.
- [How to Set Up a Print Kiosk in India](/blog/how-to-setup-print-kiosk) -- the setup walkthrough.""",

    "snaprint-franchise-print-kiosk-investment.mdx": """## Further reading

- [Print Kiosk Cost in India](/blog/print-kiosk-cost-india) -- the cost breakdown across models.
- [Is a Print Kiosk Profitable? ROI for Shop Owners](/blog/print-kiosk-profitability-roi) -- whether the investment pays back.""",
}

for filename, section in further_reading.items():
    path = os.path.join("content/blog", filename)
    with open(path, "r") as fh:
        text = fh.read()
    if not text.endswith("\n"):
        text += "\n"
    text += "\n" + section + "\n"
    with open(path, "w") as fh:
        fh.write(text)
    print(f"Linked: {filename}")
print("Done.")
