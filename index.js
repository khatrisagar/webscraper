const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser    // we have to pss an inpormation from an array so we have to use this


const movies = [
    "https://www.imdb.com/title/tt0242519/?ref_=nv_sr_srsg_3",
    "https://www.imdb.com/title/tt10698680/?ref_=fn_al_tt_1",
    "https://www.imdb.com/title/tt8178634/?ref_=fn_al_tt_1",
    "https://www.imdb.com/title/tt9389998/?ref_=tt_tpks_tt_i_1_pd_tp1_pbr_ic",
];

(async() =>{
    let imdbData = [];
    
    for(let movie of movies){
        const response = await request({
            uri: movie,
            header: {
                // adding accept header
                "accept":" text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip: true, 
        })
        let $ = cheerio.load(response);
        let title =  $('div[class="sc-80d4314-1 fbQftq"] > h1').text()
        let rating  =  $('div[class="sc-7ab21ed2-0 fAePGh"] > div > span  ').text()
        let summary = $('div[class="sc-16ede01-7 hrgVKw"] > span ').text()
        let release_year=  $('a[class="ipc-link ipc-link--baseAlt ipc-link--inherit-color sc-8c396aa2-1 WIUyh"]').text()
    
        imdbData.push({
            title, 
            rating, 
            summary, 
            release_year,
        })
    }


    const j2cp = new json2csv()
    const csv = j2cp.parse(imdbData)

    fs.writeFileSync("./imdb.csv", csv, "utf-8")
}
)()


