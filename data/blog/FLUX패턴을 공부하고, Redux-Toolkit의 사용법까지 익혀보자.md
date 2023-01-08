---
title: FLUX패턴을 공부하고, Redux-Toolkit의 사용법까지 익혀보자
date: '2022-10-21'
tags: ['자바스크립트', '리액트', '리덕스']
draft: false
summary: Redux-Toolkit, 생각보다 어렵지 않습니다. 한번 읽고나면 이해가 될 수도 있으니 한번쯤 읽어보시는 것도 나쁘지 않습니다.
---

리액트에서 전역 상태관리를 위한 기술은 정말 종류가 많다. Recoil, Redux-Toolkit, MobX, XState 등등 종류는 정말 많고, 기술들은 각각의 특성이 있기 때문에 상황에 맞는 기술을 사용하는 것이 좋다. 


근데 이 기술들중 개인적으로 필수적으로 알아야 한다고 생각하는 기술이 있는데, 바로 Redux-Toolkit이다. 

사실 모든 기술은 내가 필요한 이유를 몸소 체감을 하고 배우게 되는게 이상적이라고 생각을 하지만, 거의 1년 넘게 리액트로 프론트엔드 개발을 했음에도 불구하고 전역상태관리 툴이 필요한 상황이 크게 없었다. 그러다보니 전역상태관리 툴들, 그중에서도 패턴이 명확하게 존재하는 리덕스를 아직까지도 제대로 잘 모르고 있었다.

> 솔직히 대부분의 서비스에서는 전역상태관리는 오버엔지니어링이라고 생각하는 편이다.


근데 최근 취업준비를 하다보니 대부분의 회사들에서 전역상태관리에 대한 이해를 요구하더라.. 이대로는 큰일나겠다 싶어서 가장 많이 사용되는 전역상태관리 기술인 Recoil과 Redux-Toolkit을 익혀야겠다고 생각했다. 


근데 왜 Redux-Toolkit을 먼저 공부하냐면,


Recoil에 비해 Redux를 사용하는 회사들이 아직 너무나도 많다. 새로 시작하는 프로젝트는 Recoil로 시작하는 경우가 많지만, 이전에 개발을 하고 유지보수를 하는 프로덕트들 중에 Redux를 사용하는 경우가 너무나도 많다.

흔히 말하는 레거시 기술인데, 내가 만약 취업을 하면 어떤 프로젝트, 어떤 팀에 붙을지 아예 모르기 때문에 이번 기회에 Redux도 익혀보기로 결정을 했다. 겸사겸사 FLUX 패턴도 공부하고, Redux에서 강제되는 패턴을 익히고자 한다. ~~그리고 Recoil은 Redux에 비해 배우기가 어렵지 않은 기술이라고 생각해서 후순위로 뒀다~~



### FLUX 패턴이 뭐고, 그게 리덕스랑 무슨 상관인데?


우선 FLUX 패턴에 대해 얘기를 하기 전에 리액트의 핵심 철학을 다시 한번 생각을 해보자.

> 단방향 데이터 흐름


단방향 데이터 흐름은 크게 두가지로 살펴볼 수가 있다.

1. 부모 컴포넌트 -> 자식 컴포넌트로 Props를 통해 데이터를 전달
2. UI -> Event Handler -> setState -> State -> UI. . .


일반적으로 부모 컴포넌트와 자식 컴포넌트가 존재할 때, 상태는 부모 컴포넌트에서 관리를 하고, 자식 컴포넌트한테 Props로 전달한다. 

그러면 그냥 자식 컴포넌트에서 상태를 각각 가지면 되지 않나 라고 생각할 수가 있는데, 만약 두개의 다른 자식 컴포넌트가 하나의 상태를 필요로 한다고 생각을 해보자. 그런 상황에서는 방법이 두가지가 있는데,

1. 각각의 자식 컴포넌트한테 각각 상태를 만들어주고, 매번 둘다 변경을 해준다.
2. 부모 컴포넌트한테 하나의 상태를 만들고, 두 자식 컴포넌트한테 Props로 전달한다. 

1번의 방식을 이용하는건 되게 비효율적으로 보인다. 휴면 에러로 인해 실수로 하나를 업데이트를 안하는 상황이 생길 수도 있고, 애초에 실수를 안한다고 치더라도 하나만 업데이트 하면 되는 걸 매번 두번씩 한다는 것 자체가 비효율적이다.

그럼 2번의 장점은 무엇이 있을까?

1. 1번과는 다르게 자식 컴포넌트의 상태를 일일히 관리할 필요가 없다.
2. 상태가 부모 컴포넌트한테 집중되어있기에 부모 컴포넌트의 상태만 추적하면 UI가 어떻게 바뀔지 예측이 쉬워진다. 


> 아하! 그럼 리액트에서 App.js에 상태를 다 박아넣으면 완전 효율적이겠다!


그럴리가 없다. 왜 그렇지 않을까?

부모 컴포넌트에서 자식 컴포넌트로 상태를 전달하려면 Props를 통해 전달을 해야한다는 건 다들 알거라고 생각한다. 그리고, 리액트로 개발을 조금이라도 해본 사람이라면 매번 Props 전달하는게 얼마나 귀찮은 일인지도 알거라고 생각한다.

그럼 만약 App.js에서 관리하는 상태가, 한 50번째 자식 컴포넌트에게 전달이 되어야 한다면? Props 전달을 50번이나 해야한다는 것이다.

개인적으로 알고리즘적으로 생각을 하는 것을 좋아하는데, n번째 자식 컴포넌트에게 Props 전달을 하려면, O(n)이라는 시간복잡도가 예상이 된다. 나쁘지 않은 것 같기도 하지만, O(nlogn), O(logn), 심지어 O(1)의 시간복잡도를 가지는 알고리즘까지 있는 상황에서 굳이 O(n)의 시간복잡도를 가지는 알고리즘을 사용해야하는 이유가 있을까? 물론 공간복잡도는 다 동일하다고 가정하자.

최상위 컴포넌트에서 모든 상태를 관리하는 것이 O(n)의 시간복잡도를 가진다고 가정하고, 이제 O(1)의 시간복잡도를 가지는 알고리즘을 한번 알아보자.


## FLUX 아키텍쳐

> 플럭스 (flux) 아키텍처는 "대규모 애플리케이션에서 일관된 데이터 관리를 손쉽게 하기 위해 만들어진 단방향 데이터 처리 과정을 가지는 아키텍처"

![](https://velog.velcdn.com/images/bokdol11859/post/b956d6f5-901b-41aa-bf1f-a0c8e11c414f/image.png)

플럭스 아키텍처의 가장 중요한 특징은 단방향 데이터 흐름이라는 점이다. 여러 개의 스토어가 상태랑 상태 변경 기능을 가지고, 여러 뷰 컴포넌트에 스토어의 상태들이 바인딩이 된다. 과정을 한번 자세히 살펴보자.

1. 뷰에서 어떤 동작이 발생하면 Action Creator가 호출이 된다. 
2. Action Creator는 Side Effect들, API 요청과같은 부작용들을 처리하고, Action을 생성하여 Dispatcher에 전달한다.
```
	- 액션은 주로 {type: "addTodo", payload: {todo: "블로그 글 작성"}}과 같은 형태를 띤다.
```
3. Dispatcher는 액션을 Store로 전달하고, Store는 액션의 정보를 이용해 상태를 변경한다.
4. 상태가 변경이 되면 변경된 스토어와 바인딩된 뷰가 갱신된다. 


> 아니 무슨 상태 하나 변경하는데 이렇게 많은 과정을 거쳐야해? 오히려 더 불편한데?

맞는 말이다. 진짜 불편하다. 그래서 아까도 언급했지만, 나는 대부분의 서비스에서 전역상태관리를 하는 것은 오버엔지니어링이라고 생각한다. 

그래도 당연히 이유가 있으니까 그렇게 많은 사람들이 쓰는 것일텐데, 무슨 장점이 있을까?

1. 아까 말했듯이 컴포넌트가 복잡해지고 많아지면 오히려 이게 더 효율적이게 된다. 
2. 모든 데이터 흐름은 Dispatcher를 거치게 되기 때문에 디스패처만 잘 관리하면 상태의 변경을 추적하기가 간편해진다. 


## Redux는 FLUX 패턴을 그대로 이용한다?

일단 결론만 보면, X이다. 물론 되게 비슷한건 맞다.

Redux는 FLUX 패턴을 이용하긴 하지만, 거기서 더 발전을 시켜 복잡성을 줄였다. 덕분에 Redux는 Hot Reloading과 Time Travel Debugging이 가능해졌다.


### Hot Reloading

기존의 FLUX 아키텍처는 스토어가 상태와 상태 변경 로직을 둘다 가진다. 그렇기에 개발 도중 상태 변경 로직이 변경이 되면 상태도 초기화가 될 수밖에 없었다. 

하지만 Redux의 스토어는 상태만 지니고, 상태 변경 로직은 Reducer라는 요소로 분리를 했다. 이렇게 상태와 상태 변경 로직이 분리가 되었기 때문에, 상태 변경 로직이 바뀌더라도 상태가 초기화가 되지 않을 수 있게 되었고, 이것을 Hot Reloading이라고 부른다. 


### Time Travel Debugging

Redux는 상태가 변경이 될 때 불변성이 필수적으로 적용이 되어야한다. 다른 말로 얘기를 하면, Redux는 상태가 변경이 될 때 마다 새로운 객체를 생성하는 것이다. 

이런 불변성을 가지는 상태 변경은 상태의 History를 남기기 때문에 상태가 어떻게 변경이 됐는지를 쉽게 추적할 수가 있고, 원하는 어떤 시점으로 다시 돌아가는 것도 가능하다. 이전 상태로 돌아가면서 디버깅을 하는 것을 Time Travel Debugging이라고 부른다.



## Redux ToolKit

여러번 얘기를 했지만, 나는 Redux같은 전역상태관리 툴을 이용하는 것은 대부분의 경우에서 오버엔지니어링이라고 생각한다. 구조가 복잡해서 러닝커브가 가파른 것도 맞지만, 사용하는 법을 알고있는 상황에서도 Redux 환경을 구축하는 것은 정말 귀찮은 일이다.

이건 정말 많은 개발자들이 공감을 하는 상황이었기에 Redux-Toolkit이라는게 나왔다.

Redux-Toolkit은 Redux에 필요한 중요 라이브러리들을 모아놓고, 훨씬 더 쉽게 사용할 수 있도록 만든 거라고 생각하면 된다. 


### Redux-Toolkit 설치하기

Redux-Toolkit을 설치하기 전에, 애플리케이션을 생성해보자.

나는 Next.js에 Typescript를 적용한 애플리케이션을 생성했다.

![](https://velog.velcdn.com/images/bokdol11859/post/2c0ec809-fa64-4d59-9dbc-9c408d178e45/image.png)

이제 VSCode에서 생성한 앱을 실행을 하자.

![](https://velog.velcdn.com/images/bokdol11859/post/2fc7cc17-d1df-473e-accf-464da9ef9d38/image.png)

기본적인 Next 서비스의 형태이다.

이제 Redux-Toolkit을 설치를 해보자.

```
yarn add react-redux @reduxjs/toolkit
```

설치가 끝나면 package.json에 

"@reduxjs/toolkit": "^1.9.1",
"react-redux": "^8.0.5",

가 추가가 된 것을 확인할 수 있다.

그럼 이제 설치는 끝이 났으니 사용을 한번 해보자. 


### Redux-Toolkit 사용하기

우선 루트 디렉토리에 redux라는 폴더를 생성하자. 그리고 redux 폴더 안에 slices라는 폴더도 하나 생성하자.

![](https://velog.velcdn.com/images/bokdol11859/post/bf3cc00d-3418-4e35-8cb7-a7c4a8600032/image.png)

이렇게 생성을 했으면, redux 폴더 안에 store.ts 파일도 생성하자. 이 파일은 아까 언급했던 redux에서 상태를 지니는 곳이라고 생각하면 된다. 

![](https://velog.velcdn.com/images/bokdol11859/post/acab7ff0-3964-478f-a05e-d8e13b5ac019/image.png)

이렇게 툴킷에서 제공하는 configureStore를 통해 store를 생성해주고, reducer는 일단 빈 객체를 할당해주자. 추후에 slice를 생성하고 할당을 해줄 것이다.


이제 아까 생성했던 slices 폴더에 새로운 slice를 만들어보자. 나는 numberSlice.tsx라는 이름을 지어주었다.

![](https://velog.velcdn.com/images/bokdol11859/post/ba145117-56f1-4089-866d-0bc34b651543/image.png)

이제 numberSlice.tsx 안에 새로운 slice를 만들어보자.

slice는 store에 들어갈 여러 상태중 하나로, 상태의 초기값과 상태를 변경하는 reducer 로직들을 선언하는 곳이다. 쉽게 생각하면 slice는 store의 일부분이라고 보면 된다.

```
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  number: 10,
};

const numberSlice = createSlice({
  name: "number",
  initialState: initialState,
  reducers: {},
});

```

이렇게 numberSlice를 생성했고, 이 number 상태를 변경하는 메서드들을 작성해보자. 나는 딱 두가지, increment/decrement 메서드를 생성할 예정이다. 

```
const numberSlice = createSlice({
  name: "number",
  initialState: initialState,
  reducers: {
    increment: (state, action) => {
        state.number += action.payload.step;
    },
    decrement: (state, action) => {
        state.number -= action.payload.step;
    }
  },
});

```

1. increment/decrement라는 이름을 가진 메서드는 인자로 state, action을 받는다. 
    - state는 말 그대로 상태, 그니까 지금 이 slice의 현재 상태값이라고 보면 된다.
    - action은 reducer가 호출이 되어서 생성되는 action인데, 메서드에 어떤 값을 넣어서 보내면 action.payload에서 참조가 가능하다. 
    
2. 위에서 언급을 했지만, 리덕스는 불변성이 언제나 지켜져야 한다. 
  상태가 변경이 되면 새로운 객체가 생성이 되어야 하는데, Redux-Toolkit은 자동으로 immer라는 라이브러리를 사용하기 때문에 번거롭게 새로 객체를 생성하고 깊은 복사를 하고 변경을 하고 할 필요 없이 그냥 바로 값을 변경하면 된다. 불변성은 immer에서 자동으로 처리를 해준다. 
   - 그렇기에 각 메서드들에서 이렇게 직접적으로 값을 변경해줄 수가 있다
   - ```
      state.number += action.payload.step;
      state.number -= action.payload.step;
     ```



이제 reducer도 다 만들었으니, 다른 컴포넌트들에서 사용할 수 있도록 export를 해주자.

```
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  number: 10,
};

const numberSlice = createSlice({
  name: "number",
  initialState: initialState,
  reducers: {
    increment: (state, action) => {
      state.number += action.payload.step;
    },
    decrement: (state, action) => {
      state.number -= action.payload.step;
    },
  },
});

export const { increment, decrement } = numberSlice.actions;

export default numberSlice.reducer;

```

Export 처리가 끝났으면 이제 store에 등록을 해줄 차례이다. Typescript 환경에서는 store의 타입값도 같이 export를 해주면 더 편하다. 

```
import { configureStore } from "@reduxjs/toolkit";
import numberSlice from "./slices/numberSlice";

const store = configureStore({
  reducer: {
    number: numberSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

```

이제 redux를 이용하기 위한 사전 작업은 끝났으니 컴포넌트에서 이 상태들을 이용해보자.


Next에서 자동으로 생성해주는 _app.tsx를 변경해주자

```
import { Provider } from "react-redux";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import store from "../redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

```

Provider 내부에 있는 모든 컴포넌트들은 store에 등록된 모든 상태들에 접근할 수 있다. 


이제 index.tsx에서 store 내부에 있는 number 상태에 접근을 해보자.

```
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function Home() {
  const { number } = useSelector((store: RootState) => store.number);

  const dispatch = useDispatch();

  return (
    <>
      <h1>{number}</h1>
      <div>
        <button onClick={() => {}}>+</button>
        <button onClick={() => {}}>-</button>
      </div>
    </>
  );
}

```

Redux에서 제공하는 훅인 useSelector를 이용해서 콜백함수를 넘겨준다. 콜백함수는 인자로 store의 모든 상태를 전달받는데, 상황에 필요한 상태를 받아오기 위해서 store.number와 같은 형태로 상태를 받아올 수 있다. 참고로 store의 타입은 아까 같이 export해주었던 store의 타입으로 지정을 해주면 된다.

나는 number라는 상태만 생성을 해줬기에 destructuring을 통해 number 변수를 따로 뽑아서 저장했다.

그리고 dispatch라는 식별자를 가진 변수에 Redux에서 제공하는 훅인 useDispatch를 통해 Dispatcher를 할당해준다.

이러면 Redux를 이용해 전역상태에 접근하고 변경하는 모든 준비가 끝이 났다.

진짜로 전역 상태에 접근을 할 수 있는건지 확인을 해보자.

```yarn dev``` 명령어를 통해 서버를 띄워보자.


![](https://velog.velcdn.com/images/bokdol11859/post/018ed560-6639-465f-8f75-6c0f9885be8b/image.png)

짜잔. 10이라는 숫자와 +- 버튼 두개가 보인다. 10이라는 숫자가 뭔가 낯이 익지 않은가?

그렇다. 10은 아까 생성했던 number slice의 초기값으로 지정해줬던 숫자이다. 확인을 다시 한번 해보자.

```
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  number: 10,
};

const numberSlice = createSlice({
  name: "number",
  initialState: initialState,
  reducers: {
    increment: (state, action) => {
      state.number += action.payload.step;
    },
    decrement: (state, action) => {
      state.number -= action.payload.step;
    },
  },
});

export const { increment, decrement } = numberSlice.actions;

export default numberSlice.reducer;

```

못믿겠으면 스크롤을 올려서 확인해보자. 

아무튼 10이라는 값을 가진 number 상태에 접근을 할 수 있는 것을 확인했다. 그럼 이제 숫자를 올리고 내려보자. 

```
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { decrement, increment } from "../redux/slices/numberSlice";

export default function Home() {
  const { number } = useSelector((store: RootState) => store.number);

  const dispatch = useDispatch();

  return (
    <>
      <h1>{number}</h1>
      <div>
        <button
          onClick={() => {
            let randomNumber: number = Math.floor(Math.random() * 100);
            dispatch(increment({ step: randomNumber }));
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            let randomNumber: number = Math.floor(Math.random() * 100);
            dispatch(decrement({ step: randomNumber }));
          }}
        >
          -
        </button>
      </div>
    </>
  );
}


```

아까 생성해줬던 increment/decrement메서드를 임포트해오자. 그리고 각 버튼들에게 onClick 프로퍼티를 할당해주고, 익명 화살표 함수를 전달해주자. 

함수안에는 randomNumber라는 0~100 사이의 랜덤 정수가 매번 새로 할당이 될 것이고, 아까 생성했던 dispatcher를 통해 increment/decrement reducer에 randomNumber를 전달해서 호출하자.

진짜 될까?

![](https://velog.velcdn.com/images/bokdol11859/post/3705e625-12c2-4efc-8436-071115fc016c/image.gif)

#### 성공



## 결론

오늘은 FLUX 패턴이 뭔지, Redux-Toolkit이 뭔지, 그리고 어떻게 사용하는지를 알아보았다.

여전히 대부분의 경우에서는 오버엔지니어링이라고 생각하지만, 몰라서 사용을 **못**하는 것과 알아도 사용을 **안**하는 것에는 분명한 차이가 있다고 생각하기에 공부해보았다. 

그래도 모달창 상태 관리같은 몇몇 특수 상황들에서는 필요할 것 같다. 조금 더 깊게 생각을 해보면, 2048같은 게임을 만들거나 백엔드 없이 프론트만 만드는 상황에서는 꽤나 도움이 될 것 같다. 그러니 잊지말고 익숙해지자.

