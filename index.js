const request=require("request-promise")
 const cheerio=require("cheerio")
 const fs=require("fs");
const { log } = require("console");
 const json2csv=require("json2csv").Parser


 const movies=[" https://www.imdb.com/title/tt0068646/?ref_=fn_al_tt_1",
                    "https://www.imdb.com/title/tt0109830/?ref_=tt_sims_tt_i_5",
                    "https://www.imdb.com/title/tt0242519/?ref_=tt_rvi_tt_i_3"


 ];
( async()=>{
  let imdbData=[]
   
  for( let movie of movies)
  {
    const response=await request({
      url:movie,
      headers:{
        "accept": 
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding":"gzip, deflate, br",
      "accept-language":"en-GB,en-US;q=0.9,en;q=0.8"
  
      },
      gzip:true ,
    });
    let $ = cheerio.load(response);
  
    let title = $("section.ipc-page-section > div > div > h1").text().trim();
    let rating = $("div.ipc-button__text > div > div:nth-child(2) > div > span")
      .text()
      .slice(0, 6);
    let imagePoster = $("div.ipc-media > img.ipc-image").attr("src");
    let ratingAmount = $(
      "div.ipc-button__text > div:last-child > div:last-child > div:last-child"
    )
      .text()
      .slice(0, 4);
    let releaseYear = $('a[href="/title/tt0068646/releaseinfo?ref_=tt_dt_rdat"]').text().slice(12);
    let moviesGenres = [];
    let movieGenresData=  $( 'div[class="ipc-chip-list__scroller"]>a');
    movieGenresData.each(
       (i, elm) => {
        let genre = $(elm).text();
        
        moviesGenres.push(genre);
      }
    );
    let summary=$('div[class="sc-16ede01-7 hrgVKw"]>span:first-child').text().trim();
  imdbData.push({
    title,
    rating,
    // ratingAmount,

    imagePoster,
    releaseYear,
  
    summary,
    moviesGenres,
    
  });
  
  
  }


const j2cp=new json2csv()
const csv=j2cp.parse(imdbData)

fs.writeFileSync("./imdb.csv",csv,"utf-8");

console.log(csv);

}



) ();