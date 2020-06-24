colors = ['arctic stainless steel', 'black', 'blue', 'brass polished', 'brilliance brushed bronze',
              'brilliance stainless', 'brilliance stainless steel',
              'brushed bronze', 'brushed chrome', 'brushed nickel', 'buffed satin stainless steel', 'champagne bronze',
              'chrome', 'chrome plated', 'chrome-plated',
              'chrome/brass', 'chrome/white', 'cocoa bronze/polished nickel', 'dark gray', 'gray', 'legacy bronze',
              'luxe gold', 'luxe nickel',
              'luxe nickel', 'luxe polished chrome', 'Luxe Nickel/Teak Wood', 'Matte Black', 'Mediterranean Bronze',
              'Nickel', 'Nickel-Plated', 'Oil Bronze', 'Oil Rubbed Bronze',
              'Oil-Rubbed Bronze', 'Old World Bronze', 'Pewter', 'Platinum Nickel',
              'Polished Brass',
              'Polished Brass-Plated',
              'Polished Chrome',
              'Polished Chrome-Plated',
              'Polished Chrome/Teak Wood',
              'Polished Nickel',
              'Rough Chrome',
              'Sani Coated',
              'Satin Nickel',
              'Silver',
              'Spotshield Stainless Steel',
              'Stainless',
              'Stainless Steel',
              'tuscan bronze',
              'Unfinished',
              'Venetian Bronze',
              'White',
              'Wrought Iron']
companies = ['ALLEN CO', 'AMERICAN STANDARD', 'BHC', 'BRADLEY', 'BRIZO', 'CFG', 'CHICAGO FAUCETS', 'COMPASS',
                 'DELTA', 'DXV', 'ELKAY', 'FIAT',
                 'GERBER', 'KROWNE METAL', 'MATCO-NORCA', 'MOEN', 'OATEY', 'PASCO', 'PEERLESS', 'PFISTER',
                 'SIOUX CHIEF', 'SLOAN', 'T&S',
                 'TOTO', 'ZURN']

color_synonyms = ['color']
company_synonyms = ['company', 'manufacturer']
colors = [x.lower() for x in colors]
companies = [x.lower() for x in companies]
# pat = '|'.join(r"\b{}\b".format(x) for x in companies)
    # df["company"] = df["input"].str.extract('(' + pat + ')', expand=False, flags=re.I)
    # feature['company'] = 1 if (not df["company"].values) else 0