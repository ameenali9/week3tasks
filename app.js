import React from "react";
import ReactDOM from "react-dom";
import Styled from "styled-components";
import 'babel-polyfill';

//giving width and center the container of the whole page
let MainCont = Styled.div `width:80%;margin:auto;`;

//Style the header that contain the logo and the search box 
function Header(props){
    let Header = Styled.div ` 
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center; `;
    let Logo   = Styled.img `width:200px;padding:50px;`;
    let SearchBox = Styled.div `position:relative;`;
    let SearchImg = Styled.img `position:absolute;width:20px;padding:8px;`;
    let SearchInput = Styled.input `
    background-color:rgba(0,0,0,0.2);
    border-radius:20px;
    width:300px;
    font-size:24px;
    color:#747779;
    border:0px;
    padding:4px 10px 4px 35px;
    outline:none;`;
    return (
        <Header>
            <div>
                <Logo src={require('./assets/logo.png')} alt="FikraSpaceNews-logo" />
            </div>
            <SearchBox>
                <SearchImg src={require('./assets/searchlogo.png')} alt="search logo" />
                <SearchInput type="search" placeholder="search" id="search" onKeyUp={props.InsertFun}/>
            </SearchBox>
        </Header>
    )
}


//articles function to show the news to the user after searching 
function Articale(props){
    let Articales = Styled.div `display:flex;`;
    let RecentLinks = Styled.div `flex-grow:2;flex-basis:1200px;`;
    return (
        <Articales>
            <RecentLinks>
                <span>Recent Links</span> <hr /> <br />
                <main id="news">{props.news}</main>  
            </RecentLinks>  
        </Articales>
    )
}

//style the articles & news that will appear in the articles container below the header of the page 
function NewData(props){
    let ArticaleContainer = Styled.article `
    display:flex;
    margin-bottom:20px;
    position:relative;
    box-shadow:1px 1px 20px rgba(0,0,0,0.2);
    border-radius:5px;
    padding:10px;`;
    let ImgContainer = Styled.div `display:flex; flex-basis:150px;`;
    let Img = Styled.img `height:150px; width:150px;`;
    let TextContainer = Styled.div `
    position:relative;
    padding:0px 80px 0px 20px;`;
    let NewsTitle = Styled.span `
    text-transform:capitalize;
    font-weight:bolder;
    display:block;
    font-family:Arial,san-serif;
    font-size:20px;
    padding:0px 4px 0px 0px;`;
    let NewsDescription  = Styled.span `
    display:block;
    color:rgba(0,0,0,0.5);
    padding:8px 0px 40px 0px;
    font-family: sans-serif;
    font-size:15px;`;
    let Time = Styled.time `
    position:absolute;
    bottom:0px;
    color:rgb(0,0,200);
    font-family: sans-serif;`;
    let VoteContainer = Styled.div `
    position:absolute;
    text-align:center;
    right:0px;
    padding-right:20px;`;
    let VoteUp = Styled.img `width:30px;height:30px;`;
    let VoteSpan = Styled.span `font-size:30px;font-weight:bolder;`;
    let VoteDown = Styled.img `width:30px;height:30px;`;
    return (
        <ArticaleContainer>
            <ImgContainer>
                <Img src={props.urlToImage} alt="news picture" />
            </ImgContainer>
            <TextContainer>
                <NewsTitle>{props.title}</NewsTitle>
                <NewsDescription>{props.description}</NewsDescription>
                <Time dateTime={props.publishedAt}>{props.publishedAt}</Time>
            </TextContainer>
            <VoteContainer>
                <VoteUp src={require('./assets/upvote.png')} />
                <br />
                <VoteSpan >{props.voutenum}</VoteSpan>
                <br />
                <VoteDown src={require('./assets/downvote.png')}/>
            </VoteContainer>
        </ArticaleContainer>
    )
}

class App extends React.Component {
    constructor (){
        super()
        this.state = {
            newsData : [],
            newsTarget : 'FCB'
        };

        //getnews from our api with target "FCB" in the opening of the page when there is nothing being searched yet .. 
        this.getNews();        
    }

    //the getnews fun. from the api
    getNews(Target = 'FCB'){
        fetch(`https://newsapi.org/v2/everything?q=${Target}&apiKey=b60f15202abc40cf895fd1162f96752b`)
        .then((response)=>{ return response.json(); })
        .then((data)=>{
            this.setState({
                newsData: data.articles
            })
        })
    }

    //creat function to get the date only when the user press "Enter" key
    onPressEnter(event){
        if (event.key == "Enter"){ 
            let target = document.getElementById('search');
            let targetValue = target.value;
            if (targetValue.length == 0){ targetValue = "messi" }
            console.log(targetValue)
            this.getNews(targetValue);
            this.setState({
                newsTarget : targetValue
            })
         }
    }

    //mapping all the articles in my newsData and then show them to the user 
    showNews() {
            return (
                this.state.newsData.map((item, i)=>{
                    //make the puplishedAt looking better in the webpage
                    let time= item.publishedAt.split('T')[0];
                return <NewData  urlToImage = {item.urlToImage} id={i} title={item.title} description={item.description} publishedAt={time}  />
                })
            )
    }
    

    render(){
        return (
            <MainCont>
                <Header InsertFun={this.onPressEnter.bind(this)} />
                <Articale news={this.showNews()}/>
            </MainCont>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

