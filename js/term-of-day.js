/**
 * Financial Term of the Day — deterministic daily rotation (local calendar day).
 * Same term for all visitors on a given day; advances at local midnight.
 */
(function () {
  "use strict";

  /** @type {{ term: string, short: string, why: string, link?: string, linkLabel?: string }[]} */
  var TERMS = [
    {
      term: "SIP",
      short: "Systematic Investment Plan — invest a fixed amount on a schedule, often monthly, into a mutual fund.",
      why: "Turns investing into a habit and can reduce the stress of timing a single big buy.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "Try SIP calculator"
    },
    {
      term: "SWP",
      short: "Systematic Withdrawal Plan — take a regular amount out of a mutual fund corpus while the rest stays invested.",
      why: "Used when you want income-like cash flow without selling everything at once.",
      link: "mutualfunds.html#swpcalc-mutual",
      linkLabel: "Try SWP calculator"
    },
    {
      term: "NAV",
      short: "Net Asset Value — the per-unit price of a mutual fund after assets, costs, and liabilities.",
      why: "You buy and sell fund units around this value, not like a stock’s live bid–ask on an exchange.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds guide"
    },
    {
      term: "Expense ratio",
      short: "The annual fee a fund charges, shown as a percent of assets, for running the portfolio.",
      why: "Small differences compound over decades — lower cost is one of the few edges you can control.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "CAGR",
      short: "Compound Annual Growth Rate — the smoothed yearly growth rate that takes you from start value to end value.",
      why: "Helps compare multi-year results; it is not a promise of steady gains each year.",
      link: "tools.html#cagr",
      linkLabel: "CAGR calculator"
    },
    {
      term: "Inflation",
      short: "The rise in general prices over time — the same rupee buys less later.",
      why: "Long goals need returns that can outpace inflation after tax and costs.",
      link: "tools.html#inflation",
      linkLabel: "Inflation tool"
    },
    {
      term: "Asset allocation",
      short: "How you split money across types of assets (equity, debt, gold, cash, and so on).",
      why: "Often drives risk and long-run results more than picking one “star” product.",
      link: "risk-allocation.html",
      linkLabel: "Risk & allocation"
    },
    {
      term: "Diversification",
      short: "Spreading money across assets, sectors, or countries so one failure hurts less.",
      why: "Does not remove loss, but can reduce the damage of a single bad bet.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Equity",
      short: "Ownership in a company — stocks or equity mutual funds/ETFs.",
      why: "Higher long-term growth potential, with sharper ups and downs along the way.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Debt fund",
      short: "A mutual fund that mainly holds bonds, treasury bills, and other fixed-income instruments.",
      why: "Usually less volatile than pure equity, but still has interest-rate and credit risk.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "Bond",
      short: "A loan you make to a government or company; you earn interest and get principal back if they pay as promised.",
      why: "Used for income and balance — check rating, tenure, and how easy it is to sell.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "YTM",
      short: "Yield to Maturity — the total return if you buy a bond at today’s price and hold it to maturity (simplified).",
      why: "Helps compare bonds with different prices and coupons; models assume no default.",
      link: "bonds.html#bond-yield-calculator",
      linkLabel: "Bond yield calculator"
    },
    {
      term: "Credit rating",
      short: "An agency’s opinion on an issuer’s ability to meet payments (for example AAA, AA, BBB).",
      why: "A guide to credit risk, not a guarantee — ratings can change.",
      link: "bonds.html#bond-ratings",
      linkLabel: "Bond ratings"
    },
    {
      term: "FD",
      short: "Fixed Deposit — bank deposit with a locked tenure and a quoted interest rate.",
      why: "Simple for short- to medium-term parking; interest is usually taxable.",
      link: "fixeddeposit.html",
      linkLabel: "FD guide"
    },
    {
      term: "RD",
      short: "Recurring Deposit — save a fixed sum every month for a set period at a quoted rate.",
      why: "Builds the saving habit for a known-ish maturity amount (bank rules apply).",
      link: "tools.html#rd",
      linkLabel: "RD calculator"
    },
    {
      term: "PPF",
      short: "Public Provident Fund — long-term government-backed small savings scheme with tax features that change with law.",
      why: "Popular for long horizons and tax-saving discussions — check current rules.",
      link: "ppf-tax-saving.html",
      linkLabel: "PPF & tax-saving"
    },
    {
      term: "NPS",
      short: "National Pension System — retirement account with market-linked options and rules on exit and annuity.",
      why: "Useful for long-term retirement building; tax and exit rules need careful reading.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      term: "ELSS",
      short: "Equity Linked Savings Scheme — equity mutual funds often discussed under tax-saving sections of the Income Tax Act.",
      why: "Equity risk with a lock-in; tax rules change — confirm for the year you invest.",
      link: "ppf-tax-saving.html",
      linkLabel: "Tax-saving options"
    },
    {
      term: "Index fund",
      short: "A fund that aims to track a market index (for example Nifty 50) rather than beat it with stock picks.",
      why: "Usually lower cost and transparent; returns will still move with the market.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "ETF",
      short: "Exchange Traded Fund — a fund you can buy and sell on the stock exchange like a share.",
      why: "Often used for low-cost index exposure; watch liquidity and tracking difference.",
      link: "etf.html",
      linkLabel: "ETF guide"
    },
    {
      term: "Tracking error",
      short: "How much a fund’s return drifts from the index it tries to follow.",
      why: "Useful when comparing two index funds or ETFs that claim the same benchmark.",
      link: "etf.html",
      linkLabel: "ETF guide"
    },
    {
      term: "AUM",
      short: "Assets Under Management — total money managed in a fund or by an AMC.",
      why: "Large AUM is not automatically “better”; look at fit, cost, and risk.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Exit load",
      short: "A fee if you redeem a mutual fund before a stated period.",
      why: "Can discourage short-term churn — read the scheme document before you buy.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Demat account",
      short: "An account that holds securities (shares, ETFs, many bonds) in electronic form.",
      why: "Needed for exchange trading of stocks and many other listed products in India.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "KYC",
      short: "Know Your Customer — identity and address verification required by regulated intermediaries.",
      why: "You usually complete KYC before investing through brokers, AMCs, or platforms.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "STT",
      short: "Securities Transaction Tax — a tax on certain securities market trades in India.",
      why: "Part of the real cost of trading; always count costs when comparing strategies.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "Capital gains",
      short: "Profit when you sell an investment for more than your cost (rules depend on asset and holding period).",
      why: "Tax treatment differs for equity, debt, gold, property, and more — confirm current law.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "LTCG",
      short: "Long-Term Capital Gains — gains on assets held beyond a threshold period defined in tax law.",
      why: "Often taxed differently from short-term gains; periods and rates change with Finance Acts.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "STCG",
      short: "Short-Term Capital Gains — gains when you sell before the long-term holding period.",
      why: "Often taxed at different rates than LTCG; check the asset class and year.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "Dividend",
      short: "A share of profits a company (or some funds) may pay to holders.",
      why: "Not guaranteed; total return also includes price change.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "P/E ratio",
      short: "Price-to-Earnings — share price divided by earnings per share (or index level vs earnings).",
      why: "A valuation clue, not a buy/sell signal by itself.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Blue chip",
      short: "Informal label for large, well-known companies often seen as relatively established.",
      why: "Still can fall hard in bad markets — “blue chip” is not a safety guarantee.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Market cap",
      short: "Market capitalisation — share price times number of shares (company’s equity market value).",
      why: "Used to group large-, mid-, and small-cap stocks or funds.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Bull market",
      short: "A period of generally rising prices and optimistic sentiment.",
      why: "Easy to feel brilliant; risk is overconfidence and forgetting drawdowns.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Bear market",
      short: "A period of generally falling prices and pessimistic sentiment.",
      why: "Painful, but also when disciplined plans and SIPs often matter most.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Volatility",
      short: "How much prices swing up and down over time.",
      why: "Higher volatility means larger temporary losses are more common — match horizon to risk.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Risk tolerance",
      short: "How much loss and uncertainty you can live with without abandoning your plan.",
      why: "If the plan panics you into selling at bottoms, it was too aggressive.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Emergency fund",
      short: "Cash or near-cash kept for job loss, medical bills, or other shocks.",
      why: "Protects long-term investments from forced sales at a bad time.",
      link: "insurance-emergency.html",
      linkLabel: "Emergency & insurance"
    },
    {
      term: "Term insurance",
      short: "Life cover for a fixed term that pays a lump sum if the insured dies during the term (policy terms apply).",
      why: "Often discussed as pure protection, separate from investing for returns.",
      link: "insurance-emergency.html",
      linkLabel: "Insurance basics"
    },
    {
      term: "Asset class",
      short: "A group of investments with similar traits — equity, debt, gold, real estate, cash.",
      why: "Building a portfolio starts with which classes you hold and in what mix.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      term: "Rebalancing",
      short: "Adjusting holdings back toward your target mix after markets move them off plan.",
      why: "Sells some winners and tops up laggards — a discipline, not a prediction.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      term: "Corpus",
      short: "The total pot of money you have built or aim to build for a goal.",
      why: "Goal planners often solve for SIP size or years needed to reach a corpus.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      term: "Horizon",
      short: "How long until you need the money for a goal.",
      why: "Short horizons usually need safer assets; long horizons can take more equity risk.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      term: "Real return",
      short: "Return after inflation (and sometimes after tax) — what purchasing power actually grew.",
      why: "A 8% nominal return with 6% inflation is only about 2% “real” before other costs.",
      link: "tools.html#inflation",
      linkLabel: "Inflation tool"
    },
    {
      term: "Nominal return",
      short: "The stated percentage gain before adjusting for inflation.",
      why: "Marketing quotes are usually nominal — always ask “after inflation and tax?”",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Liquidity",
      short: "How quickly you can turn an asset into cash without a big price hit.",
      why: "Property and some bonds can be hard to exit fast; listed stocks and many funds are easier.",
      link: "realestate.html",
      linkLabel: "Real estate guide"
    },
    {
      term: "REIT",
      short: "Real Estate Investment Trust — listed vehicles that own property portfolios; you buy units like shares.",
      why: "A way to get property exposure without buying a flat — still has market and sector risk.",
      link: "realestate.html",
      linkLabel: "Real estate guide"
    },
    {
      term: "EMI",
      short: "Equated Monthly Instalment — fixed monthly loan payment covering interest and principal.",
      why: "Home and other loans: know EMI before you stretch for a property.",
      link: "tools.html#emi",
      linkLabel: "EMI calculator"
    },
    {
      term: "Leverage",
      short: "Using borrowed money (or derivatives) so gains and losses are amplified.",
      why: "Can multiply returns and wipe out capital — common in F&O and some trading.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      term: "Futures",
      short: "A contract to buy or sell something later at a price agreed now, marked to market daily.",
      why: "High risk for retail; margin calls and time decay of mistakes are real.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      term: "Option",
      short: "A contract that gives the right, not the obligation, to buy (call) or sell (put) at a strike by expiry.",
      why: "Buyers risk mainly premium; sellers can face large losses — education only on this site.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      term: "Premium (options)",
      short: "The price paid for an option contract (per unit or for the lot, depending on context).",
      why: "For buyers, this is often the maximum loss if the option expires worthless.",
      link: "futures-options.html#fo-calc",
      linkLabel: "F&O calculator"
    },
    {
      term: "Intraday trading",
      short: "Buying and selling the same day, aiming for small moves; positions usually closed by close.",
      why: "Costs, speed, and discipline dominate — most retail day traders lose money after costs.",
      link: "intraday.html",
      linkLabel: "Intraday guide"
    },
    {
      term: "IPO",
      short: "Initial Public Offering — a company sells shares to the public and lists on an exchange.",
      why: "Allotment is not guaranteed; listing gains are not guaranteed either.",
      link: "ipo.html",
      linkLabel: "IPO guide"
    },
    {
      term: "Allotment",
      short: "Getting shares in an IPO (or other issue) when demand is high and lots are distributed by rules.",
      why: "You may get zero, partial, or full lot — plan cash and expectations.",
      link: "ipo.html",
      linkLabel: "IPO guide"
    },
    {
      term: "Listing gains",
      short: "Price change between IPO issue price and the first trading day (or open), often discussed in media.",
      why: "Past listing pops do not predict the next IPO.",
      link: "ipo.html#listing-gains",
      linkLabel: "Listing-day sketch"
    },
    {
      term: "SGB",
      short: "Sovereign Gold Bond — government gold bonds with interest features and holding rules.",
      why: "One way to hold gold exposure without physical storage; read issue terms.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      term: "Physical gold",
      short: "Coins, bars, or jewellery you can touch — value depends on purity, making charges, and resale spreads.",
      why: "Jewellery often costs more than “metal price” due to making charges.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      term: "Crypto",
      short: "Cryptocurrency — digital assets on blockchains; highly volatile and regulated carefully in many places.",
      why: "Treat as high-risk if at all; size small relative to core goals.",
      link: "cryptocurrencies.html",
      linkLabel: "Crypto guide"
    },
    {
      term: "Dollar-cost averaging",
      short: "Investing fixed amounts on a schedule regardless of price (SIPs are a common form).",
      why: "You buy more units when prices are low and fewer when high — still not risk-free.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "SIP calculator"
    },
    {
      term: "Lump sum",
      short: "Investing a large amount in one go instead of spreading over time.",
      why: "Can work with a long horizon, but timing luck matters more than with SIPs.",
      link: "tools.html#lumpsum",
      linkLabel: "Lump sum tool"
    },
    {
      term: "Compounding",
      short: "Earning returns on both original money and earlier returns — growth on growth.",
      why: "Time in the market and reinvestment matter as much as the rate you assume.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Simple interest",
      short: "Interest only on the original principal, not on accumulated interest.",
      why: "Some products quote simple interest — compare carefully with compound options.",
      link: "fixeddeposit.html",
      linkLabel: "FD guide"
    },
    {
      term: "Compound interest",
      short: "Interest calculated on principal plus prior interest (frequency matters).",
      why: "Quarterly vs yearly compounding changes the maturity amount for the same headline rate.",
      link: "fixeddeposit.html#fd-calculator",
      linkLabel: "FD calculator"
    },
    {
      term: "Coupon",
      short: "The interest rate a bond pays on its face value (for example 7.5% annual coupon).",
      why: "If you buy above or below face value, your actual yield differs from the coupon.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "Face value",
      short: "The bond’s par amount (often ₹100 or ₹1,000) used to compute coupons and redemption.",
      why: "Market price can differ from face value as rates and credit views change.",
      link: "bonds.html#bond-yield-calculator",
      linkLabel: "Yield calculator"
    },
    {
      term: "Laddering",
      short: "Staggering maturities of FDs or bonds so cash comes due in steps.",
      why: "Balances reinvestment risk and access to cash without one giant maturity date.",
      link: "fixeddeposit.html#fd-ladder-tool",
      linkLabel: "FD ladder"
    },
    {
      term: "G-Sec",
      short: "Government Security — bonds issued by the central government.",
      why: "Generally lower credit risk than corporates; price still moves with interest rates.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "RBI Retail Direct",
      short: "A facility for retail investors to access government securities in a more direct way.",
      why: "One official path to G-Secs — use official portals and understand tenure risk.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "Post Office schemes",
      short: "Small savings products via India Post (RD, TD, MIS, NSC, KVP, and others) with notified rates.",
      why: "Useful conservative sleeve for some households; rates and rules change by notification.",
      link: "postoffice.html",
      linkLabel: "Post Office guide"
    },
    {
      term: "MIS",
      short: "Monthly Income Scheme (Post Office) — designed around regular interest payouts with principal rules.",
      why: "Income-style cash flow, not equity growth — check eligibility and current rates.",
      link: "postoffice.html",
      linkLabel: "Post Office guide"
    },
    {
      term: "NSC",
      short: "National Savings Certificate — a small savings certificate product with fixed tenure themes.",
      why: "Often discussed for tax-saving baskets — confirm current tax treatment each year.",
      link: "postoffice.html",
      linkLabel: "Post Office guide"
    },
    {
      term: "KVP",
      short: "Kisan Vikas Patra — small savings product aimed at roughly doubling money over a notified period.",
      why: "Lock-in and rate notifications matter; treat as conservative, not equity-like.",
      link: "postoffice.html",
      linkLabel: "Post Office guide"
    },
    {
      term: "Benchmark",
      short: "A reference index or rate used to judge a fund or portfolio (for example Nifty 50).",
      why: "Without a benchmark, “good return” is hard to define.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "Active fund",
      short: "A fund where managers pick securities trying to beat a benchmark after costs.",
      why: "Can outperform or underperform; fees and consistency matter.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "Passive fund",
      short: "A fund that aims to match an index, not beat it, usually at lower cost.",
      why: "You still take full market risk of that index.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "Direct plan",
      short: "Mutual fund plan bought without distributor commission in the expense structure (you invest yourself or via execution-only platforms).",
      why: "Usually lower expense ratio than regular plans over long periods.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Regular plan",
      short: "Mutual fund plan that includes distributor commission in its cost structure.",
      why: "Advice may be bundled; compare costs with direct if you are self-directed.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Folio",
      short: "Your account number with a mutual fund AMC holding your units.",
      why: "Keep folios organised for tax reports, nominations, and consolidations.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Nomination",
      short: "Naming who receives your investments if you pass away (process depends on product).",
      why: "Basic hygiene for every account — demat, bank, mutual fund, PPF, NPS.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Risk-free rate",
      short: "A theoretical return on a default-free asset; in teaching, often compared to government T-bills or similar.",
      why: "Used as a baseline when people talk about “extra return” for taking risk.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "Risk premium",
      short: "Extra expected return investors demand for taking more risk than a safer asset.",
      why: "Equity’s long-run edge is not free — it is paid for with drawdowns.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Drawdown",
      short: "The fall from a peak to a trough in portfolio value before a new high.",
      why: "Knowing your worst historical-style drops helps you pick a mix you can stick with.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Rupee cost averaging",
      short: "Same idea as dollar-cost averaging — fixed rupee amounts on a schedule (SIP).",
      why: "A behaviour tool, not a magic shield against long bear markets.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Goal-based investing",
      short: "Matching each goal (house, education, retirement) with amount, date, and a suitable risk mix.",
      why: "Beats one vague “wealth” bucket with no deadline or purpose.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      term: "Step-up SIP",
      short: "Raising your SIP amount each year (for example with salary hikes).",
      why: "Can reach goals faster than a flat SIP if cash flow allows.",
      link: "mutualfunds.html#sipcalc-mutual",
      linkLabel: "SIP calculator"
    },
    {
      term: "Annuity",
      short: "A product that can convert a lump sum into a stream of payments (common in pension contexts).",
      why: "NPS and retirement plans often involve annuity rules at exit — read current regulations.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      term: "Tier I (NPS)",
      short: "The main NPS retirement account with contribution and withdrawal restrictions.",
      why: "Built for long-term retirement, not short-term trading.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      term: "Tier II (NPS)",
      short: "A more flexible NPS account layer with different withdrawal rules than Tier I.",
      why: "Not a substitute for understanding Tier I retirement rules.",
      link: "nps.html",
      linkLabel: "NPS guide"
    },
    {
      term: "Sensex / Nifty",
      short: "Major Indian stock market indices tracking baskets of large companies.",
      why: "Common benchmarks for equity funds and “the market” in everyday talk.",
      link: "index-vs-active.html",
      linkLabel: "Index guide"
    },
    {
      term: "Beta",
      short: "A measure of how much an investment tends to move relative to a market benchmark.",
      why: "High beta can mean larger swings than the index — for advanced reading of risk.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Alpha",
      short: "Return above (or below) what you’d expect from market risk alone — often after fees in practice.",
      why: "True lasting alpha is hard; costs are certain.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "Portfolio",
      short: "The full set of investments you hold across accounts and products.",
      why: "Think of the whole pie, not only one fund’s recent chart.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      term: "Reinvestment risk",
      short: "The risk that when a bond or FD matures, new rates are lower than before.",
      why: "Laddering can spread this risk across years.",
      link: "bonds.html#bond-ladder-tool",
      linkLabel: "Bond ladder"
    },
    {
      term: "Interest-rate risk",
      short: "When market rates rise, existing bond prices usually fall (and vice versa).",
      why: "Long-duration debt can lose market value even if the issuer still pays coupons.",
      link: "bonds.html",
      linkLabel: "Bonds guide"
    },
    {
      term: "Credit risk",
      short: "The risk that a borrower does not pay interest or principal on time.",
      why: "Higher yield often means higher credit risk — read ratings and issuer health.",
      link: "bonds.html#bond-ratings",
      linkLabel: "Ratings"
    },
    {
      term: "Default",
      short: "Failure to meet a debt payment when due.",
      why: "Ratings and history are opinions and past data — not insurance.",
      link: "bonds.html#bond-ratings",
      linkLabel: "Ratings"
    },
    {
      term: "Currency risk",
      short: "When foreign investments move with the INR exchange rate as well as the asset price.",
      why: "US stocks can gain in dollars but look different in rupees if the dollar weakens.",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      term: "LRS",
      short: "Liberalised Remittance Scheme — framework under which resident individuals may send money abroad within limits and rules.",
      why: "Relevant for US stocks and overseas investing — check RBI and tax updates.",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      term: "ADR / GDR",
      short: "Depositary receipts that let shares of a company trade on foreign exchanges in a packaged form.",
      why: "One path some investors use for overseas names — structure and tax differ from local shares.",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      term: "Brokerage",
      short: "Fees a broker charges for executing trades (plus other statutory charges).",
      why: "High turnover strategies die by a thousand fees.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Bid–ask spread",
      short: "Gap between the highest buy price and lowest sell price in the market.",
      why: "Wide spreads on illiquid names quietly tax every trade.",
      link: "etf.html",
      linkLabel: "ETF guide"
    },
    {
      term: "Circuit limit",
      short: "Exchange rules that pause or limit how far a stock can move in a session.",
      why: "You may not exit at the price you want in a panic.",
      link: "stocks.html",
      linkLabel: "Stocks guide"
    },
    {
      term: "Stop-loss",
      short: "An order or personal rule to exit if price falls to a level you set.",
      why: "Helps cap damage in trading; gaps can still slip past your level.",
      link: "intraday.html",
      linkLabel: "Intraday guide"
    },
    {
      term: "Margin",
      short: "Money or collateral you post to open leveraged positions.",
      why: "Brokers can issue margin calls; losses can exceed what you first put in on some products.",
      link: "futures-options.html",
      linkLabel: "F&O guide"
    },
    {
      term: "SEBI",
      short: "Securities and Exchange Board of India — the main markets regulator for securities.",
      why: "Rules for brokers, funds, and disclosures exist to protect market integrity — not to pick winners for you.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "AMC",
      short: "Asset Management Company — the firm that runs mutual funds.",
      why: "You invest in schemes; the AMC is the manager, not a return guarantee.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Folio consolidation",
      short: "Merging multiple folios of the same AMC/holding pattern for simpler records.",
      why: "Reduces paperwork chaos at tax time and during nominations.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "XIRR",
      short: "Extended Internal Rate of Return — a personal rate of return when cash flows happen on many dates (SIPs, redemptions).",
      why: "Better than a simple gain % when money went in and out at different times.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Absolute return",
      short: "Total percentage gain or loss over a period, not annualised.",
      why: "A 50% gain over 10 years is very different from 50% in one year.",
      link: "tools.html#cagr",
      linkLabel: "CAGR tool"
    },
    {
      term: "Annualised return",
      short: "Return expressed as a per-year rate (for example CAGR) for easier comparison.",
      why: "Helps compare different time periods — still not a forecast.",
      link: "tools.html#cagr",
      linkLabel: "CAGR tool"
    },
    {
      term: "Tax harvesting",
      short: "Planning sales to use tax rules efficiently (for example losses offsetting gains) within the law.",
      why: "Advanced and personal — get professional help; this site is not tax advice.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "Indexation",
      short: "Adjusting purchase cost for inflation when computing some capital gains (rules depend on asset and law year).",
      why: "Used to be central for some debt/property math — always verify current tax law.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "TDS",
      short: "Tax Deducted at Source — tax withheld when certain payments (interest, and other cases) are made.",
      why: "FD interest and other income streams may show TDS — claim or adjust in your return as rules allow.",
      link: "fixeddeposit.html",
      linkLabel: "FD tax notes"
    },
    {
      term: "Risk capacity",
      short: "How much risk you can afford based on income, savings, and time — separate from emotional comfort.",
      why: "Young earners with stable jobs often have more capacity than retirees living on a portfolio.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Glide path",
      short: "A plan to shift from more growth assets to safer ones as a goal date nears.",
      why: "Common in retirement target-date thinking — reduce equity shock risk near need date.",
      link: "investmentgoal.html",
      linkLabel: "Goal planner"
    },
    {
      term: "Core–satellite",
      short: "A portfolio design: a stable “core” (often index) plus smaller “satellite” bets.",
      why: "Keeps most money simple while allowing limited experimentation.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      term: "Opportunity cost",
      short: "What you give up by choosing one use of money over another.",
      why: "Cash under the mattress “costs” the returns a sensible plan might have earned (with risk).",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Behavioural bias",
      short: "Mental shortcuts that lead to poor money decisions (panic selling, FOMO buying, recency bias).",
      why: "A written plan and automation (SIP) fight bias better than willpower alone.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "FOMO",
      short: "Fear Of Missing Out — chasing a hot tip or rally because others seem to be winning.",
      why: "Often buys high; pair excitement with a written allocation you can defend.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Recency bias",
      short: "Over-weighting what just happened (last year’s best fund or worst crash) when deciding.",
      why: "Markets mean-revert and cycle — history is longer than last month’s chart.",
      link: "risk-allocation.html",
      linkLabel: "Risk guide"
    },
    {
      term: "Home bias",
      short: "Preferring only domestic investments even when global diversification might help.",
      why: "India growth is great to own — concentration is still a risk to name.",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      term: "Rupee depreciation",
      short: "When INR weakens so one dollar (or other foreign unit) costs more rupees.",
      why: "Affects import costs, foreign travel, and rupee returns on overseas assets.",
      link: "usstocks.html",
      linkLabel: "US stocks guide"
    },
    {
      term: "Crude oil (as a macro driver)",
      short: "A global energy price that influences inflation, deficits, and market mood in oil-importing countries like India.",
      why: "Not a stock tip — a backdrop for costs and sentiment.",
      link: "index.html#kpi",
      linkLabel: "Home price tools"
    },
    {
      term: "Safe haven",
      short: "Assets people flock to in stress (often gold or strong-currency bonds) — behaviour, not a law of nature.",
      why: "“Safe” assets can still fall or lag for years.",
      link: "gold.html",
      linkLabel: "Gold guide"
    },
    {
      term: "Hedge",
      short: "A position meant to offset risk in another holding (imperfect in real life).",
      why: "Gold or debt can dampen equity stress but may drag returns in bull markets.",
      link: "risk-allocation.html",
      linkLabel: "Allocation guide"
    },
    {
      term: "Unit (mutual fund)",
      short: "A slice of a mutual fund scheme; your holding = units × NAV.",
      why: "SIP buys units at each instalment’s applicable NAV.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "IDCW",
      short: "Income Distribution cum Capital Withdrawal — modern label for fund “dividend” style payouts in India.",
      why: "Payouts are not free money; NAV falls when IDCW is paid.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Growth option",
      short: "Mutual fund option that reinvests earnings into NAV instead of paying IDCW.",
      why: "Often cleaner for long-term compounding if you do not need cash from the fund.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Hybrid fund",
      short: "A fund mixing equity and debt (and sometimes other assets) in one scheme.",
      why: "Convenience mix — still read the equity share and riskometer.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Riskometer",
      short: "SEBI-mandated pictorial risk level on mutual fund documents.",
      why: "A starting label — not a personal suitability certificate.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Scheme Information Document",
      short: "The formal document describing a mutual fund’s objective, risks, and costs.",
      why: "Skim before you invest; marketing one-pagers omit detail.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Factsheet",
      short: "A periodic summary of a fund’s performance, portfolio, and metrics.",
      why: "Useful for monitoring — past performance is still not a guarantee.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Benchmark hugging",
      short: "When an “active” fund stays so close to its index that you mostly paid active fees for index-like returns.",
      why: "Compare active share and fees honestly.",
      link: "index-vs-active.html",
      linkLabel: "Index vs active"
    },
    {
      term: "Total expense ratio (TER)",
      short: "All-in annual fund cost ratio charged to the scheme (within regulatory caps).",
      why: "Lower TER compounds in your favour over long SIP decades.",
      link: "mutualfunds.html",
      linkLabel: "Mutual funds"
    },
    {
      term: "Stamp duty",
      short: "A tax on certain transactions (including some security purchases) under applicable law.",
      why: "Another line item in “all-in cost” of investing and trading.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "GST on fees",
      short: "Goods and Services Tax applied on many financial service charges.",
      why: "Brokerage and some fees are not only the headline rate you first notice.",
      link: "tax-overview.html",
      linkLabel: "Tax overview"
    },
    {
      term: "Net worth",
      short: "What you own minus what you owe.",
      why: "A clearer progress score than income alone.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Cash flow",
      short: "Money in minus money out over a period.",
      why: "SIPs only work if monthly cash flow actually supports them.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Sinking fund",
      short: "Saving gradually for a known future expense (insurance premium, school fees, gadget replacement).",
      why: "Keeps big bills from becoming high-interest debt.",
      link: "basics.html",
      linkLabel: "How to start"
    },
    {
      term: "Bridge loan / top-up",
      short: "Extra borrowing patterns people use around property or liquidity needs — terms vary by lender.",
      why: "Debt can help or hurt; model EMI before you sign.",
      link: "realestate.html#re-buy-calc",
      linkLabel: "Home buy calculator"
    },
    {
      term: "Loan-to-value (LTV)",
      short: "Loan size as a share of the property’s value.",
      why: "Higher LTV means less equity buffer if prices fall.",
      link: "realestate.html",
      linkLabel: "Real estate guide"
    },
    {
      term: "RERA",
      short: "Real Estate (Regulation and Development) Act framework for project registration and buyer protections (state rules apply).",
      why: "Check project registration and documents before paying a builder.",
      link: "realestate.html",
      linkLabel: "Real estate guide"
    },
    {
      term: "Stamp duty (property)",
      short: "State levy on property transfer documents — a major day-one cost of buying a home.",
      why: "Budget it with registration and extras, not only the agreement price.",
      link: "realestate.html#re-buy-calc",
      linkLabel: "Home buy cost"
    },
    {
      term: "Under-construction risk",
      short: "Risk that a property project is delayed or stuck before you get possession.",
      why: "You may pay EMI and rent together — plan buffers.",
      link: "realestate.html",
      linkLabel: "Real estate guide"
    },
    {
      term: "Opportunity set",
      short: "The range of investments available to you given law, access, and knowledge.",
      why: "You do not need every product — a small clear set beats a crowded mess.",
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

  function pickTerm() {
    if (!TERMS.length) return null;
    var i = dayNumberLocal() % TERMS.length;
    // Ensure non-negative for any engine quirks
    if (i < 0) i += TERMS.length;
    return { index: i, item: TERMS[i], total: TERMS.length };
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
    var root = document.getElementById("term-of-day");
    if (!root) return;
    var picked = pickTerm();
    if (!picked) return;
    var t = picked.item;

    var termEl = document.getElementById("tod-term");
    var defEl = document.getElementById("tod-definition");
    var whyEl = document.getElementById("tod-why");
    var dateEl = document.getElementById("tod-date");
    var linkEl = document.getElementById("tod-link");
    var metaEl = document.getElementById("tod-meta");

    if (termEl) termEl.textContent = t.term;
    if (defEl) defEl.textContent = t.short;
    if (whyEl) {
      whyEl.innerHTML =
        "<strong>Why it matters:</strong> " + escapeHtml(t.why);
    }
    if (dateEl) dateEl.textContent = formatDateLabel();
    if (metaEl) {
      metaEl.textContent =
        "Term " +
        (picked.index + 1) +
        " of " +
        picked.total +
        " · rotates daily at midnight (your time)";
    }
    if (linkEl) {
      if (t.link) {
        linkEl.href = t.link;
        linkEl.textContent = t.linkLabel || "Learn more";
        linkEl.hidden = false;
      } else {
        linkEl.hidden = true;
      }
    }

    root.setAttribute("data-term-index", String(picked.index));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
