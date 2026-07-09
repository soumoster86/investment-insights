/**
 * Today's Financial Fact — deterministic daily rotation (local calendar day).
 * Educational “Did you know?” style notes for Indian investors. Not advice.
 */
(function () {
  "use strict";

  /** @type {{ fact: string, detail?: string, link?: string, linkLabel?: string }[]} */
  var FACTS = [
    {
      fact: "Starting a SIP about 10 years earlier can roughly double a retirement corpus under the same monthly amount and return assumption.",
      detail: "Time in the market compounds harder than most people expect — delay is expensive.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "Try SIP calculator"
    },
    {
      fact: "A 1% higher fund expense ratio can wipe out a large share of wealth over 20–30 years of SIPs.",
      detail: "Costs compound against you the same way returns compound for you.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      fact: "Inflation near 5–6% halves the purchasing power of idle cash in roughly 12–14 years.",
      detail: "Emergency cash is necessary; all-cash forever still has a silent cost.",
      link: "tools.html#inflation",
      linkLabel: "Inflation tool"
    },
    {
      fact: "Missing a few early SIP years often hurts more than missing the same years near the goal date.",
      detail: "Early contributions get more years of compounding.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "Equity markets have historically delivered higher long-run returns than pure debt — with sharper drawdowns along the way.",
      detail: "The extra return is payment for volatility you must be able to hold through.",
      link: "risk-allocation.html",
      linkLabel: "Risk & allocation"
    },
    {
      fact: "A 30% market fall needs about a 43% gain just to get back to even.",
      detail: "Recovery math is asymmetric — risk management matters.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Diversification does not guarantee profit, but it can reduce the damage of a single bad stock or sector.",
      detail: "One company risk is optional; market risk is not if you own equities.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      fact: "Index funds and ETFs often cost less than active funds that try to beat the same benchmark.",
      detail: "Lower costs are one of the few advantages you can lock in advance.",
      link: "etf.html",
      linkLabel: "ETF guide"
    },
    {
      fact: "Direct mutual fund plans usually have a lower expense ratio than regular plans of the same scheme.",
      detail: "Over long SIPs, the gap can be material.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "NAV is not a stock price — it is the fund’s per-unit value after assets and liabilities.",
      detail: "You generally transact around NAV rules, not a live exchange bid–ask for the fund unit itself.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds guide"
    },
    {
      fact: "An emergency fund of a few months’ essential expenses can stop you from selling SIPs in a crisis.",
      detail: "Job loss and medical bills are portfolio events if cash is missing.",
      link: "insurance-emergency.html",
      linkLabel: "Emergency fund"
    },
    {
      fact: "Term life insurance is for protection; mutual funds are for growth — mixing the two often raises cost and confusion.",
      detail: "Clear jobs for each product beat expensive hybrids sold as “one solution.”",
      link: "insurance-emergency.html",
      linkLabel: "Insurance basics"
    },
    {
      fact: "Credit card interest rates can dwarf typical long-term equity returns — debt payoff is often the best “investment.”",
      detail: "A guaranteed high negative return is hard to beat with any SIP.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "FD interest is usually taxable as per your slab, even when it “auto-renews” and you do not withdraw it.",
      detail: "Tax treatment differs from some small-savings products — check current rules.",
      link: "fixeddeposit.html",
      linkLabel: "FD guide"
    },
    {
      fact: "Quarterly compounding on an FD produces a slightly higher maturity amount than the same annual rate compounded yearly.",
      detail: "Always compare effective yield, not only the brochure headline.",
      link: "fixeddeposit.html#fd-calculator",
      linkLabel: "FD calculator"
    },
    {
      fact: "Bond prices generally fall when market interest rates rise (and rise when rates fall).",
      detail: "You can lose market value on “safe” debt if you sell before maturity.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      fact: "A higher bond yield often means higher credit risk, rate risk, or both — not a free lunch.",
      detail: "Read the rating and the reason for the yield gap.",
      link: "bonds.html#bond-ratings",
      linkLabel: "Bond ratings"
    },
    {
      fact: "AAA is an opinion on credit quality, not a promise that the bond cannot be downgraded.",
      detail: "Ratings change; risk management does not end at purchase.",
      link: "bonds.html#bond-ratings",
      linkLabel: "Ratings"
    },
    {
      fact: "Laddering FDs or bonds staggers maturities so cash becomes available in steps instead of one big date.",
      detail: "Helps with reinvestment risk and planned expenses.",
      link: "fixeddeposit.html#fd-ladder-tool",
      linkLabel: "FD ladder"
    },
    {
      fact: "Gold often moves differently from equities in some stress periods — which is why small allocations appear in many plans.",
      detail: "It can also lag for years; size it as a diversifier, not a lottery ticket.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      fact: "Jewellery making charges mean your gold ornaments often cost more than the pure metal price.",
      detail: "Investment gold and wedding gold are different decisions.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      fact: "REITs let you own a slice of property portfolios on the exchange without buying a full flat.",
      detail: "They still carry market risk, interest-rate sensitivity, and sector risk.",
      link: "realestate.html",
      linkLabel: "Real estate guide"
    },
    {
      fact: "Home EMI plus rent (if you still rent while paying a loan) can crush savings rates for years.",
      detail: "Model day-one costs and EMI before you stretch for a property.",
      link: "realestate.html#re-buy-calc",
      linkLabel: "Home buy calculator"
    },
    {
      fact: "Stamp duty and registration can add a large percentage on top of a home’s agreement value.",
      detail: "Budget the full day-one cash, not only the down payment.",
      link: "realestate.html#re-buy-calc",
      linkLabel: "Home buy cost"
    },
    {
      fact: "Most retail day traders lose money after brokerage, taxes, and behavioural errors.",
      detail: "Intraday is closer to a skill sport than a wealth plan for most people.",
      link: "intraday.html",
      linkLabel: "Intraday guide"
    },
    {
      fact: "Futures and options can lose more than your initial margin in stressed markets.",
      detail: "Leverage multiplies lessons into crises without a hard loss limit.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      fact: "Option buyers often risk mainly the premium; option sellers can face large or theoretically unlimited losses on some structures.",
      detail: "Know which side of the contract you are on before you click.",
      link: "futures-options.html#fo-calc",
      linkLabel: "F&O calculator"
    },
    {
      fact: "IPO listing gains in the past do not predict the next IPO’s listing day move.",
      detail: "Allotment is uncertain; listing can open below issue price too.",
      link: "ipo.html#listing-gains",
      linkLabel: "Listing-day sketch"
    },
    {
      fact: "US stocks add currency risk: rupee returns depend on both the asset and the USD–INR rate.",
      detail: "A gain in dollars can look different after conversion.",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      fact: "LRS and tax rules shape how resident Indians invest abroad — they change and need verification.",
      detail: "Access is not the same as “no paperwork or tax.”",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      fact: "Crypto can move 20–50% in short periods; position size matters more than conviction tweets.",
      detail: "Treat it as high-risk capital if you participate at all.",
      link: "cryptocurrencies.html",
      linkLabel: "Crypto guide"
    },
    {
      fact: "Asset allocation (equity vs debt vs other) often explains more of long-run results than fund-picking skill.",
      detail: "Get the mix right before optimising the last 0.1% of return.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      fact: "Rebalancing forces you to trim what ran up and top up what lagged — uncomfortable and useful.",
      detail: "It is a rules-based way to “buy low, sell high” without predictions.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "A step-up SIP that rises with salary can reach a goal faster than a flat SIP of the same starting amount.",
      detail: "If cash flow allows, growth in contributions matches career growth.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "SIP calculator"
    },
    {
      fact: "SWP withdrawals that exceed growth will shrink the corpus — sometimes to zero before you expect.",
      detail: "Model the path; do not assume the pot lasts forever.",
      link: "mutualfunds.html#swpcalc-mutual",
      linkLabel: "SWP calculator"
    },
    {
      fact: "PPF and many small-savings rates are notified and can change; they are not equity-like growth engines.",
      detail: "Useful conservative tools — still check current rules and tax treatment.",
      link: "ppf-tax-saving.html",
      linkLabel: "PPF & tax-saving"
    },
    {
      fact: "NPS is built for long retirement horizons with contribution and exit rules that differ from open mutual funds.",
      detail: "Read annuity and withdrawal framework before you treat it like a trading account.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      fact: "ELSS funds carry equity risk even when discussed under tax-saving sections of the law.",
      detail: "Tax benefit themes do not remove market drawdowns or lock-in realities.",
      link: "ppf-tax-saving.html",
      linkLabel: "Tax-saving options"
    },
    {
      fact: "Post Office RD, TD, MIS, NSC, and KVP each solve different cash-flow needs — rates are notified, not guessed.",
      detail: "Match the product to the goal, then confirm the latest circular.",
      link: "postoffice.html",
      linkLabel: "Post Office guide"
    },
    {
      fact: "Tracking error tells you how much an index fund or ETF drifts from its benchmark.",
      detail: "Two Nifty funds are not identical if costs and tracking differ.",
      link: "etf.html",
      linkLabel: "ETF guide"
    },
    {
      fact: "Bid–ask spreads on illiquid stocks or ETFs are a hidden trading cost every time you enter or exit.",
      detail: "Liquidity is part of total cost.",
      link: "etf.html",
      linkLabel: "ETF guide"
    },
    {
      fact: "STT, brokerage, GST, and stamp duty can turn high-turnover strategies into a fee machine.",
      detail: "Count all-in costs before you call frequent trading “investing.”",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      fact: "Long-term and short-term capital gains rules differ by asset and holding period — and Finance Acts can change them.",
      detail: "Always verify the year you sell; this site is not tax advice.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      fact: "IDCW (dividend-style) payouts from funds reduce NAV — you are not getting “free” money on top of the unit value.",
      detail: "Growth options reinvest inside the NAV instead.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "A demat account holds shares and many ETFs electronically; KYC is the gate to regulated investing.",
      detail: "Paperwork first, products second.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Nomination on bank, demat, mutual fund, PPF, and NPS accounts is basic estate hygiene.",
      detail: "Your family should not need a treasure hunt.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Rupee-cost averaging (SIP) buys more units when prices are low and fewer when high — it does not remove loss risk.",
      detail: "It is a behaviour tool, not a guarantee of profit.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "A goal without a date and amount is a wish; a date without funding is a deadline with stress.",
      detail: "Connect SIP, horizon, and target corpus in one plan.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "Real returns are what remain after inflation (and often after tax) — nominal charts look better than life feels.",
      detail: "Ask “what can I buy with this corpus later?”",
      link: "tools.html#inflation",
      linkLabel: "Inflation tool"
    },
    {
      fact: "CAGR smooths a bumpy path into one annualised number — actual years can be much better or worse.",
      detail: "Use it to compare, not to promise a straight line.",
      link: "tools.html#cagr",
      linkLabel: "CAGR tool"
    },
    {
      fact: "Crude oil prices influence inflation and sentiment in oil-importing economies like India.",
      detail: "A macro backdrop — not a stock tip by itself.",
      link: "index.html#kpi",
      linkLabel: "Home price tools"
    },
    {
      fact: "Home bias means many investors own only domestic assets even when global diversification is available.",
      detail: "India growth is valuable; concentration is still a choice with risk.",
      link: "usstocks.html",
      linkLabel: "US stocks"
    },
    {
      fact: "Behavioural biases — FOMO, panic selling, recency bias — often cost more than a slightly imperfect fund choice.",
      detail: "Automation and written rules fight bias better than willpower.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "An expense you finance at 36% interest needs an extraordinary investment return just to break even after risk.",
      detail: "High-cost debt usually wins the race against SIPs.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Sensex and Nifty are baskets of large companies — owning the index is not the same as owning one stock.",
      detail: "Index risk is market risk, not single-stock blow-up risk.",
      link: "index-vs-active.html",
      linkLabel: "Index guide"
    },
    {
      fact: "Active funds can underperform their benchmark for years even when the manager is well known.",
      detail: "Fees plus human error are a high bar to clear consistently.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      fact: "A folio is your mutual fund account number with an AMC — multiple folios of the same holding can create paperwork clutter.",
      detail: "Consolidation and clean nominations save future pain.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "XIRR is often a fairer personal return measure than a simple gain % when SIPs and withdrawals happen on many dates.",
      detail: "Cash-flow timing changes the real rate you experienced.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Sovereign Gold Bonds include interest features and holding rules that differ from physical gold or gold ETFs.",
      detail: "Compare costs, liquidity, and tax themes carefully for each form of gold.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      fact: "G-Secs are government securities — generally lower credit risk than corporates, but still sensitive to interest rates.",
      detail: "Price can move before maturity if you sell in the market.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      fact: "Retail investors can access some government securities through official channels such as RBI Retail Direct.",
      detail: "Use official portals and understand tenure before you buy.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      fact: "Exit loads discourage very short holding periods in some mutual funds — read them before you invest for a near expense.",
      detail: "Short goals often need debt or cash, not equity funds with lock-in friction.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "A riskometer is a label, not a personal suitability certificate for your life situation.",
      detail: "Your horizon and emergency fund still decide what you can hold.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Circuit limits can freeze trading in a stock so you cannot exit at the price you wanted.",
      detail: "Illiquid or volatile names need extra caution.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      fact: "P/E ratios are valuation clues, not buy or sell buttons.",
      detail: "Cheap can get cheaper; expensive can stay expensive.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      fact: "Dividends are not guaranteed; companies can cut or skip them.",
      detail: "Total return includes price change plus any dividends.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      fact: "Market cap groups companies by size — large, mid, and small caps behave differently in cycles.",
      detail: "Smaller names can grow faster and fall harder.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      fact: "A bull market makes almost everyone look skilled; a bear market reveals process.",
      detail: "Judge a plan across full cycles, not one green year.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Your risk capacity (money you can afford to lose time on) can differ from risk tolerance (what your stomach allows).",
      detail: "Design for the tighter of the two.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Core–satellite investing keeps most money in a simple core and a smaller sleeve for experiments.",
      detail: "Limits damage from “fun” ideas.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      fact: "A glide path reduces equity risk as a goal date nears so a late crash hurts less.",
      detail: "Common sense for education or house goals inside five years.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "Opportunity cost is the return you gave up by parking money in a low-yield place too long — or by taking reckless risk.",
      detail: "Every rupee has a next-best use.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Net worth (assets minus liabilities) tracks progress better than salary alone.",
      detail: "A raise that increases lifestyle debt may not raise net worth.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "A sinking fund for known bills (insurance, fees, travel) prevents “surprise” borrowing.",
      detail: "Predictable expenses should not hit the credit card by default.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Loan-to-value (LTV) measures how much of a property is financed — higher LTV means less equity buffer.",
      detail: "Price drops hurt leveraged buyers more.",
      link: "realestate.html",
      linkLabel: "Real estate"
    },
    {
      fact: "RERA registration is a basic check before paying a builder for an under-construction project.",
      detail: "Process and documents reduce — not eliminate — project risk.",
      link: "realestate.html",
      linkLabel: "Real estate"
    },
    {
      fact: "Under-construction homes can leave you paying EMI and rent together if possession slips.",
      detail: "Cash-flow stress is a real risk, not only “price risk.”",
      link: "realestate.html",
      linkLabel: "Real estate"
    },
    {
      fact: "MIS-style products focus on payout income; equity SIPs focus on long-term growth — different jobs.",
      detail: "Do not force one product to do everything.",
      link: "postoffice.html",
      linkLabel: "Post Office"
    },
    {
      fact: "NSC and similar certificates are longish lock-ins with notified rates — not day-trading instruments.",
      detail: "Liquidity planning matters before you buy.",
      link: "postoffice.html",
      linkLabel: "Post Office"
    },
    {
      fact: "KVP-style products are often framed around roughly doubling money over a notified period — still confirm current terms.",
      detail: "Notifications change; read before you commit.",
      link: "postoffice.html",
      linkLabel: "Post Office"
    },
    {
      fact: "Tier I NPS is the main retirement bucket with stricter rules; Tier II is more flexible but is not a substitute for understanding Tier I.",
      detail: "Know which account you are funding.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      fact: "Annuities can turn a lump sum into a payment stream — rules and rates vary and need careful reading at retirement.",
      detail: "NPS exit design often involves this choice.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      fact: "Hybrid funds mix equity and debt in one scheme — convenience with a blended risk level.",
      detail: "Still read the equity share and riskometer.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "AUM size does not automatically mean a fund is better for you.",
      detail: "Fit, cost, and risk matter more than popularity.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Benchmark hugging active funds may charge active fees for index-like portfolios.",
      detail: "Compare costs and how different the portfolio really is.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      fact: "TER (total expense ratio) is the all-in annual cost charged inside a scheme within regulatory caps.",
      detail: "Small TER gaps compound across decades of SIP.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Coupon is the bond’s stated interest on face value; your yield depends on the price you actually pay.",
      detail: "Buying above par lowers yield versus the coupon.",
      link: "bonds.html#bond-yield-calculator",
      linkLabel: "Yield calculator"
    },
    {
      fact: "YTM estimates total return if you hold a bond to maturity under simplified assumptions (including no default).",
      detail: "Useful comparison tool — not a guarantee.",
      link: "bonds.html#bond-yield-calculator",
      linkLabel: "Bond yield"
    },
    {
      fact: "Reinvestment risk is the chance that maturing money must be reinvested at lower rates.",
      detail: "Ladders spread that risk across years.",
      link: "bonds.html#bond-ladder-tool",
      linkLabel: "Bond ladder"
    },
    {
      fact: "Default risk is the chance an issuer misses payments — higher yield often prices some of that risk in.",
      detail: "Ratings and research reduce ignorance; they do not remove risk.",
      link: "bonds.html#bond-ratings",
      linkLabel: "Ratings"
    },
    {
      fact: "Stop-loss orders can limit damage in trading, but gaps can still open beyond your stop.",
      detail: "A tool, not a force field.",
      link: "intraday.html",
      linkLabel: "Intraday"
    },
    {
      fact: "Margin is collateral for leveraged positions; margin calls can force exits at the worst time.",
      detail: "Only risk money you can lose without touching goals.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      fact: "SEBI regulates securities markets in India — rules protect market integrity, not your individual profit.",
      detail: "Compliance is not a performance promise.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "An AMC runs mutual funds; you own units of a scheme, not a share of the AMC (unless you buy the AMC’s stock).",
      detail: "Know what you actually hold.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Absolute return of 50% over 10 years is very different from 50% in one year — always check the period.",
      detail: "Annualise carefully when you compare.",
      link: "tools.html#cagr",
      linkLabel: "CAGR tool"
    },
    {
      fact: "Tax-loss harvesting and advanced tax tactics are personal — rules are complex and change.",
      detail: "Educational sites are not a substitute for a qualified professional.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      fact: "TDS may be deducted on some interest payments; you may still need to report income in your return.",
      detail: "Keep statements; reconcile at filing time.",
      link: "fixeddeposit.html",
      linkLabel: "FD tax notes"
    },
    {
      fact: "GST applies on many financial service fees — the headline brokerage is not always the all-in cost.",
      detail: "Read contract notes.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      fact: "A portfolio you cannot explain on one page is often too complex to hold through stress.",
      detail: "Simplify until clarity returns.",
      link: "risk-allocation.html",
      linkLabel: "Allocation"
    },
    {
      fact: "Cash under the mattress avoids market risk and guarantees inflation risk.",
      detail: "Match the tool to the job: emergency vs growth.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "You do not need dozens of funds — a few clear building blocks funded every month beat a crowded mess.",
      detail: "Behaviour scales better than product count.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Past performance is a rear-view mirror; your SIP funds the road ahead.",
      detail: "Use history for ranges, not promises.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "If a product needs high-pressure urgency to sell, slow down and read the document at home.",
      detail: "Good investments can usually wait a night.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Insurance is priced for protection; investments are priced for uncertain returns — keep the jobs separate.",
      detail: "Mixing them often raises cost per unit of either benefit.",
      link: "insurance-emergency.html",
      linkLabel: "Insurance"
    },
    {
      fact: "A 20s investor buying time with SIPs often beats a 40s investor trying to “catch up” with leverage.",
      detail: "Start earlier if you can; increase later if you must.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "Comparison with friends’ returns ignores fees, risk, taxes, and luck — a poor benchmark.",
      detail: "Your goals are the scoreboard.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Peace of mind is part of total return — a portfolio that ruins sleep is too aggressive.",
      detail: "Survive the path to the goal.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Hope is not a hedge; diversification, cash buffers, and insurance are.",
      detail: "Write the protections down.",
      link: "insurance-emergency.html",
      linkLabel: "Emergency & insurance"
    },
    {
      fact: "Markets reward patience measured in years and punish impatience measured in days.",
      detail: "Match the chart timeframe to the goal timeframe.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "You cannot buy yesterday’s return at today’s price — chasing last year’s winner often means buying high.",
      detail: "Process beats recency bias.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Risk is not only volatility numbers — it is the chance you abandon the plan at the bottom.",
      detail: "Design for stickiness.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Save like a pessimist (buffers); invest like a cautious optimist (growth assets with a plan).",
      detail: "Both mindsets can live in one household budget.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "The goal of investing is funding a life — not winning an argument on social media.",
      detail: "Quiet compounding beats loud tips.",
      link: "learn.html",
      linkLabel: "Learn hub"
    },
    {
      fact: "Every expert was once a beginner who kept a simple plan long enough.",
      detail: "Start small, stay consistent, keep learning.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "Inflation is a thief that does not need to pick your pocket — it waits on cash that never works.",
      detail: "Long goals need growth in the mix.",
      link: "tools.html#inflation",
      linkLabel: "Inflation"
    },
    {
      fact: "A SIP in a chronically poor fund is still a SIP in a poor fund — review calmly once a year, not every day.",
      detail: "Tinkering has costs too.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      fact: "Leverage turns a learning mistake into a capital crisis faster than almost anything else.",
      detail: "Prefer unlevered learning with money you can lose.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      fact: "Your allocation should survive a bull-market story and a bear-market invoice.",
      detail: "Ask: what if equity is down 30% next year?",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Getting rich slowly with compounding usually beats getting poor quickly with tips.",
      detail: "Speed is not a virtue in wealth building.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "Documents, KYC, and nominations before dashboards and predictions.",
      detail: "Foundations first.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "If you would not fund it with this month’s salary surplus, do not fund it with next year’s school fees.",
      detail: "Source of money reveals true risk.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "The market is a tool; you are the operator — tools do not care about your goals.",
      detail: "You must bring the plan.",
      link: "learn.html",
      linkLabel: "Learn hub"
    },
    {
      fact: "Consistency is underrated because it does not trend on social media.",
      detail: "Monthly SIPs are quietly powerful.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "SIP calculator"
    },
    {
      fact: "Label your activity honestly: investing, trading, or gambling — then size it accordingly.",
      detail: "Honesty prevents accidental high risk.",
      link: "intraday.html",
      linkLabel: "Intraday"
    },
    {
      fact: "A long-term chart teaches; a one-day chart mostly reflects mood.",
      detail: "Pick the timeframe that matches your goal.",
      link: "stocks.html",
      linkLabel: "Stocks"
    },
    {
      fact: "When everyone feels like a genius, check the cycle; when everyone feels hopeless, check your SIP is still on.",
      detail: "Sentiment extremes are information, not orders.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      fact: "Build the portfolio you can explain to your family on one page.",
      detail: "If it needs a novel, simplify.",
      link: "risk-allocation.html",
      linkLabel: "Allocation"
    },
    {
      fact: "The best time to fix allocation was last year; the second best is your next salary credit.",
      detail: "Act on the calendar you control.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      fact: "Wealth is often built in boring months and protected in scary ones — same written plan for both.",
      detail: "Do not invent a new personality in a crash.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      fact: "You are not late. You are here. Begin with a small automatic SIP if cash flow allows.",
      detail: "Starting beats perfect timing.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "Start a SIP plan"
    },
    {
      fact: "A 10-year SIP at a constant assumed return is only a model — real markets zig and zag.",
      detail: "Use calculators for education, not guarantees.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "SIP calculator"
    },
    {
      fact: "Doubling time at a steady rate is a teaching shortcut (rule of 72 style) — reality is messier.",
      detail: "Still useful to feel why early years matter.",
      link: "tools.html#cagr",
      linkLabel: "CAGR tool"
    },
    {
      fact: "An RD builds the saving habit with monthly deposits; an FD parks a lump sum for a tenure.",
      detail: "Different cash-flow shapes for different needs.",
      link: "tools.html#rd",
      linkLabel: "RD calculator"
    },
    {
      fact: "EMI is principal plus interest packed into a fixed monthly bill — stretch less than the bank will allow if cash is tight.",
      detail: "Approval limits are not comfort limits.",
      link: "tools.html#emi",
      linkLabel: "EMI calculator"
    },
    {
      fact: "Currency conversion costs and spreads make frequent FX trading expensive for households.",
      detail: "Travel and remit with eyes open on the all-in rate.",
      link: "index.html#kpi",
      linkLabel: "Currency tool"
    },
    {
      fact: "Metal rates on dashboards are snapshots — jewellery quotes and purity differ from pure investment metal.",
      detail: "Know which price you are looking at.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      fact: "A financial fact of the day is still not personal advice — your numbers, risk, and goals decide what fits.",
      detail: "Use facts to learn; use a plan to act.",
      link: "learn.html",
      linkLabel: "Learn hub"
    }
  ];

  function dayNumberLocal() {
    var d = new Date();
    return Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000
    );
  }

  function pickFact() {
    if (!FACTS.length) return null;
    // Different offset from term (+0) and quote (+17)
    var i = (dayNumberLocal() + 41) % FACTS.length;
    if (i < 0) i += FACTS.length;
    return { index: i, item: FACTS[i], total: FACTS.length };
  }

  function formatDateLabel() {
    try {
      return new Date().toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return new Date().toDateString();
    }
  }

  function escapeHtml(s) {
    if (window.IIUtil && window.IIUtil.escapeHtml) {
      return window.IIUtil.escapeHtml(s);
    }
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    var root = document.getElementById("fact-of-day");
    if (!root) return;
    var picked = pickFact();
    if (!picked) return;
    var f = picked.item;

    var factEl = document.getElementById("fod-fact");
    var detailEl = document.getElementById("fod-detail");
    var dateEl = document.getElementById("fod-date");
    var metaEl = document.getElementById("fod-meta");
    var linkEl = document.getElementById("fod-link");

    if (factEl) factEl.textContent = f.fact;
    if (detailEl) {
      if (f.detail) {
        detailEl.innerHTML =
          "<strong>Why it helps:</strong> " + escapeHtml(f.detail);
        detailEl.hidden = false;
      } else {
        detailEl.hidden = true;
      }
    }
    if (dateEl) dateEl.textContent = formatDateLabel();
    if (metaEl) {
      metaEl.textContent =
        "Fact " +
        (picked.index + 1) +
        " of " +
        picked.total +
        " · rotates daily · educational only";
    }
    if (linkEl) {
      if (f.link) {
        linkEl.href = f.link;
        linkEl.textContent = f.linkLabel || "Learn more";
        linkEl.hidden = false;
      } else {
        linkEl.hidden = true;
      }
    }
    root.setAttribute("data-fact-index", String(picked.index));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
