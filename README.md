# 초기 세팅

## 서버
```
$ npm install express nodemon concurrently puppeteer 
```

## 리액트 생성
```
$ npx create-react-app client --template typescript
```

## 프록시 설정(client)
```
$ npm install http-proxy-middleware
```

## Sass 설치(client)
```
$ npm install node-sass@4.14.0
```
> CRA에서는 4.14.0(하위) 버전으로 설치


## 헤로쿠 배포시 퍼펫티어 빌드팩 추가

Here is what worked for me. First, I clear all my buildpacks and then I added the puppeteer-heroku-buildpack and the heroku/nodejs one:

```
$ heroku buildpacks:clear
$ heroku buildpacks:add --index 1 https://github.com/jontewks/puppeteer-heroku-buildpack
$ heroku buildpacks:add --index 1 heroku/nodejs
```

Then, add the following args to the puppeteer launch function:

```javascript
const browser = await puppeteer.launch({
  'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
});
```

Finally, deploy it back to Heroku:

```
$ git add .
$ git commit -m "Fixing deployment issue"
$ git push heroku master
```

### 참고 url
[Puppeteer unable to run on heroku](https://stackoverflow.com/questions/52225461/puppeteer-unable-to-run-on-heroku)
