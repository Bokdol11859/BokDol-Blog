---
title: 리액트 생명주기에 대한 깊은 관찰 (Life Cycle, Hook Flow)
date: '2023-01-04'
tags: ['리액트', 'React']
draft: false
summary: 리액트 Life Cycle 또는 Hook Flow가 뭔지 모르신다면 읽어보시는 것도 나쁘지 않습니다
---

### 리액트에서 클래스 컴포넌트와 함수 컴포넌트는 각기 다른 방식의 생명주기를 갖는다는 사실, 알고 계셨나요?

이 글을 읽고 계시는 분들은 대부분 리액트 Hooks를 사용하실거라고 생각합니다.

혹시라도 리액트 훅이 뭔지 모르시는 분들을 위해 간단히 설명을 하자면,

    React Hooks는 리액트를 만든 메타(페이스북)에서 16.8버전에 추가한 기능으로,
    이전처럼 Class Component형태를 이용해서 컴포넌트 개발을 하는게 아닌,
    조금 더 간편하고 간단한 Function Component형태를 이용해서 컴포넌트 개발을 할 수 있도록 하는 기능

### 클래스 컴포넌트 Class Component

```
import React, { Component } from 'react';

class Hello extends React.Component {
  constructor(props) {
    this.state = { name: "복돌" }
  }
  render() {
    return (
      <div>Hello {this.props.name}</div>
    );
  }
}

export default Hello;
```

> 말 그대로 컴포넌트를 자바스크립트 클래스 형태로 구성을 하는 방식. Constructor 메서드가 필요하다

### 함수 컴포넌트 Function Component

```

import React from 'react';

function Hello(props) {
    return (
        <div>Hello {props.name}</div>
    );
}

export default Hello;
```

> 함수 컴포넌트는 거추장스러운 extends React.Component도 필요 없고, constructor 메서드도 따로 필요가 없다

그럼 이제 이번 글의 주제인 생명주기에 대해서 얘기를 해보고자 합니다

~~_아래부턴 좀 편한 말투로 적겠습니다_~~

## 생명주기? 그게 뭐야?

> 컴포넌트가 "생성", "변경", "삭제" 되는 사이클을 Life Cycle, 생명주기 라고 부른다

조금 더 리액트스럽게 표현을 하자면, 컴포넌트가

1. 마운트 되는 단계
2. 업데이트 되는 단계
3. 언마운트 되는 단계

를 컴포넌트의 생명주기라고 부른다.

# 클래스 컴포넌트의 생명주기

![](https://velog.velcdn.com/images/bokdol11859/post/ee07eb20-063d-4413-a55b-cd5c7bb84f04/image.png)

컴포넌트의 생명주기에는 각 단계에서 자동으로 호출되는 메서드들이 존재한다.

생명주기가 크게 세단계로 나뉘는 것 처럼, 생명주기 메서드도 크게 세가지가 존재한다고 보면 된다.

### 1. 마운트 단계 (componentDidMount)

영어를 그대로 번역을 하면

Component: 컴포넌트
Did: 했다
Mount: 마운트

>     컴포넌트, 했다, 마운트.

말 그대로 컴포넌트가 마운트 되었을 때 실행되는 메서드이다.

### 2. 업데이트 단계 (componentDidUpdate)

이번에도 영어를 그대로 번역을 하면

Component: 컴포넌트
Did: 했다
Update: 업데이트

>     컴포넌트, 했다, 업데이트.

이것 역시 말 그대로 컴포넌트가 업데이트 되었을 때 실행되는 메서드라는 것을 알 수 있다.

### 3. 언마운트 단계 (componentWillUpdate)

다시 한번 영어를 그대로 번역을 하면

Component: 컴포넌트
Will: 할거다
Unmount: 언마운트

영어가 조금 달라서 헷갈리겠지만 잘 따라오길 바란다.

>     컴포넌트, 할거다, 언마운트.

컴포넌트가 언마운트될 때 실행되는 메서드라는 것을 알 수 있다.

사실 클래스 컴포넌트의 생명주기는 이렇게 구성이 된다는 것만 알아도 최소한은 아는거라고 보면 된다. 근데 이 글을 읽고 있다는건 조금 더 자세히 알고 싶으니까 읽고 있는거라고 생각한다. 그러니 조금 더 자세히 살펴보자

![](https://velog.velcdn.com/images/bokdol11859/post/b1600dbd-5d7b-451f-83a2-b75502b8bc56/image.png)

이 사진을 다시 한번 자세히 보면 각각의 단계가 상세하게 나와있는걸 볼수있다.

마운트 단계에 호출되는 메서드들을 순서대로 살펴보자.

## 마운트 단계

### 1. Constructor

클래스 컴포넌트에서 상태를 초기화할 때 호출되는 메서드이다.

컴포넌트가 새로 그려질 때에는 그 컴포넌트의 상태들이 알맞게 초기화되어야 한다. 그러니 초기화를 시키기 위해 constructor 메서드를 마운트 단계에 가장 우선적으로 호출하는 것을 확인할 수 있다.

### 2. getDerivedStateFromProps

> Derive의 뜻 (네이버 영어사전) 1.끌어내다 2.유래하다
> 3.…에서 비롯되다

아까처럼 영어를 그대로 번역을 해보자면

get: 받다
Derived: 끌어내진, 유래된, 비롯된
State: 상태
From: ...로부터
Props: 속성

> 받다, 비롯된, 상태, 로부터, 속성

#### 속성으로부터 비롯된 상태를 받다

리액트의 컴포넌트들은 부모 컴포넌트로부터 Props, 속성을 전달받는 경우가 많다. 보통 전달받은 속성을 그대로 사용하는 경우가 대부분이지만, 가끔 속성에 따라서 어쩔 수 없이 컴포넌트의 상태가 변경이 되어야하는 경우들이 있는데, 그런 경우에 사용하는 메서드라고 보면 된다.

> 하지만 리액트가 일반적인 경우에선 필요가 없을 것이라고 [공식문서](https://ko.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)에 적어놓았다
> ![](https://velog.velcdn.com/images/bokdol11859/post/3c44b6bc-098a-4ece-8fc7-c7e620bef48e/image.png)

### 3. render

이전 단계들에서 컴포넌트의 상태와 속성을 초기화시키고 나면, 리액트가 이제 가상DOM에 그리기 시작하는데, 그때 호출되는 메서드이다.

```
render() {
    return (
      <div>Hello {this.props.name}</div>
    );
  }
```

### 4. componentDidMount

마운트 단계에서 실행되는 최종 메서드이다. 컴포넌트가 마운트가 완료가 되고, DOM에 반영이 된 후에 호출이 된다.

이 단계에서 일반적으로 추가적인 초기화 작업들이 진행이 된다고 보면 된다. 예를 들어 백엔드로부터 어떤 데이터를 받아오고 DOM에 출력을 해야한다면 이 메서드에서 진행을 하면 된다.

백엔드로부터 데이터를 받아오고 상태를 변경하려면 setState를 실행하게 되는데, 그러면 자동으로 컴포넌트의 업데이트 단계로 넘어가지게 된다.

## 업데이트 단계

업데이트는 주로 세가지 이유로 발생하게 된다.

1. new props
2. setState
3. forceUpdate

새로운 속성을 전달받거나, setState함수가 호출이 되거나, forceUpdate함수가 호출이 되면 자동으로 업데이트 단계가 진행이된다.

그럼 이제 컴포넌트가 업데이트될 때 실행되는 메서드들을 순서대로 살펴보자.

### 1. getDerivedStateFromProps

마운트 단계와 동일하다고 보면 된다.

### 2. shouldComponentUpdate

이번에도 영어를 이해해보자

should: 해야한다 (해야하나?)
component: 컴포넌트
update: 업데이트

> 해야하나?, 컴포넌트, 업데이트

**컴포넌트 업데이트 해야하나?**

말 그대로이다. 컴포넌트 업데이트를 해야하는지를 구분하는 메서드라고 보면 된다.

```
shouldComponentUpdate(nextProps: Props, nextState: State): boolean {}
```

메서드가 인자로 받는 nextProps와 nextState는 컴포넌트가 새로 전달받은 속성과 상태이다. shouldComponentUpdate메서드는 컴포넌트의 이전 속성과 상태를 새로 전달받은 속성과 상태랑 비교를 해서, 만약 변경점을 발견하면 True를, 발견하지 못한다면 False를 반환한다.

만약 True가 반환이 된다면, 상태/속성에 변경이 발생했다는 뜻이므로 컴포넌트를 다시 렌더링을 해야하기 때문에 render메서드가 호출이 된다

만약 False가 반환이 된다면, 상태/속성에 변경이 발생하지 않았다는 뜻이므로 컴포넌트를 렌더링하지 않아도 되기 때문에 render메서드를 건너뛴다.

> forceUpdate 함수를 통해 컴포넌트가 업데이트 되는 경우에는 shouldComponentUpdate메서드가 실행이 되지 않는다. 이유는 forceUpdate함수는 말 그대로 update를 강제시키기 때문에, 업데이트가 필요한지를 굳이 확인할 필요가 없기 때문이다.

### 3. render

앞서 실행된 shouldComponentUpdate 메서드에서 true가 반환이 되었거나, forceUpdate로 인해 업데이트 되는 경우에 실행이 된다. 변경된 상태/속성에 따라서 마운트 단계의 render와 똑같이 진행이 된다.

### 4. getSnapshotBeforeUpdate

이 메서드는 render 메서드가 실행이 되고 난 후에 실행이 되는 함수이다. 더 정확히 말하자면, 가상 DOM에는 업데이트가 완료가 되었고, 브라우저 DOM에 업데이트가 되기 직전에 실행이 된다.

이 다음이 실행될 componentDidUpdate 메서드에 어떤 값을 전달을 해주고 싶을 때 사용한다고 보면 된다.

### 5. componentDidUpdate

컴포넌트의 업데이트 단계에서 마지막으로 실행되는 메서드이다. 다시 한번 영어를 이해해보자

component: 컴포넌트
did: 했다
update: 업데이트

> 컴포넌트 했다 업데이트

**컴포넌트가 업데이트를 했다**

```
componentDidUpdate(prevProps, prevState, snapshot){}
```

세번째 인자로 이전에 실행했던 getSnapshotBeforeUpdate함수의 반환값이 전달되는 것을 볼 수 있다.

이 메서드는 브라우저 DOM에도 업데이트가 완료된 후 실행이 된다.

## 언마운트 단계

언마운트 단계에서는 하나의 메서드만 호출이 된다.

### 1. componentWillUnmount

Component: 컴포넌트
Will: 할거다
Unmount: 언마운트

>     컴포넌트, 할거다, 언마운트.

**컴포넌트 언마운트 할거다**

말 그대로 이 메서드는 컴포넌트가 언마운트되기 직전에 실행되는 메서드로, componentDidMount랑 같이 활용이 된다.

예를 들어 componentDidMount에서 setTimeout 함수를 실행했을 경우에, componentWillUnmount에서는 clearTimeout 함수를 실행해줘야한다. 그러지 않으면 불필요한 메모리 낭비가 발생하기 때문이다.

# 함수 컴포넌트의 생명주기

![](https://velog.velcdn.com/images/bokdol11859/post/1cb05a01-ac20-4461-b77a-6a8e90cfb880/image.png)

함수 컴포넌트의 생명주기는 큰틀로 봤을 때는 클래스 컴포넌트랑 비슷하다. 하지만 내부 동작은 완전히 다르다.

## 마운트 단계

### 1. Run Lazy Initializers

> Lazy initializer (레이지 초기화)가 뭘까?

함수 컴포넌트에서는 상태를 생성할 때 useState() 함수를 호출하고, 일반적으로 인자로 상태의 초기값을 넘겨준다. 하지만 useState를 통해 상태를 초기화하는 방식이 또 존재한다. 바로 콜백 함수를 인자로 전달하는 방법이다.

```
  일반적인 useState 사용법

  const [getter, setter] = useState(initialValue)


  레이지 초기화

  const [getter, setter] = useState(() => {})
```

> 왜 레이지 초기화가 필요할까?

이유만 먼저 말을 하자면, 최적화를 위한 거라고 보면 된다.

어떤 함수 컴포넌트가 호출이 되면, 매번 useState가 새로 호출이 되고 초기화가 된다.

사실 이부분은 크게 문제가 안된다. 하지만 만약 초기화하려는 값이 복잡한 로직을 통해 도출이 되는 값이라면?

매번 컴포넌트가 새로 호출 될 때마다 그 복잡한 로직을 매번 새로 실행을 하게 되는데, 성능적으로 당연히 문제가 생기게 된다.

예를 들어

```
const [name, setName] = useState("복돌")
```

이라는 상태를 매번 초기화 해야한다면, 초기화 하는 과정에서 복잡한 로직이 전혀 없기 때문에 성능적으로도 문제가 되지 않는다. 하지만

```
const decodedToken = jwt_decode(localStorage.getItem("access_token"))
const [userInfo, setUserInfo] = useState(decodedToken)
```

이렇게 상태를 초기화하는 경우에는 이전과는 조금 다르다는 것을 알 수 있다.

1. 로컬스토리지로부터 "access_token"이라는 이름을 가진 데이터를 불러오고
2. 토큰 값의 정보를 읽어내기 위해 복호화 과정을 거치고
3. useState에 초기값으로 decodedToken을 넘겨준다

이렇게 단계만 보더라도 세단계로 나뉘는데, 각각의 단계가 간단한 로직이 아니라는 것을 알 수 있다.

그럼 만약 이 컴포넌트가 몇십번, 몇백번 호출이 되어야 한다면, 똑같은 토큰 값, 똑같은 decodedToken값임에도 불구하고, 이 똑같은 연산이 몇십번 몇백번 반복되어야 한다는 문제가 발생한다.

### 이런 경우에 사용하는게 레이지 초기화이다

```

const [userInfo, setUserInfo] = useState(() => {
	const decodedToken = jwt_decode(localStorage.getItem("access_token"))
    return decodedToken
})
```

이런식으로 useState 안에 콜백함수를 전달하는 방식인데, 리액트는 자동으로 이 콜백함수의 결과값을 저장하고 (Memoization), 추후에 이 함수의 실행이 필요할 때마다 이 저장된 값을 불러온다.

> 레이지 초기화를 통해 초기화 된 상태는 컴포넌트가 마운트 될 때만 실행이 된다.

### 2. Render

함수 컴포넌트 내부 코드가 실행되는 타이밍이다. 이 타이밍에 가상 DOM에 발생할 변경점들이 기록된다.

### 3. React updates DOM

이전 단계인 Render에서 기록된 변경점들이 가상 DOM에 적용되는 시점이다.

### 4. Run LayoutEffects

useLayoutEffect라는 훅에 전달된 콜백 함수를 실행하는 시점이다.

> useLayoutEffect가 뭘까?

useEffect와 사용법이 완전히 동일한 훅이라고 보면 된다

```
useLayoutEffect(() => {

  return () => {

  };
}, [])
```

```
useEffect(() => {

  return () => {

  }
}, [])
```

그럼 무슨 차이가 있길래 따로 훅을 만들어놓은걸까? 그 정답은 바로 지금 얘기중이었던 실행 시점에 있다.

뒤에도 얘기를 할거지만, useEffect는 브라우저 DOM이 그려지고 나서 실행이 된다. 따라서 만약 useEffect가 상태를 변경하는 로직을 갖고 있다면,

1. 상태의 초기값을 기준으로 DOM을 그리고
2. useEffect가 실행이 되어 상태가 변경이 되고
3. 리렌더링이 발생해서 DOM을 새로 그린다.

이 과정에서 사용자는 초기값이 그려진 DOM과, 상태가 변경된 후의 DOM의 차이를 체감하게 된다.
![](https://velog.velcdn.com/images/bokdol11859/post/eb357673-846a-412e-9ac0-0c5595be81bf/image.gif)

이런걸 방지하기 위해 useLayoutEffect를 사용한다. useLayoutEffect는 DOM에 그려지기 전에 실행이 되는 useEffect라고 생각하면 편한데, 그렇기 때문에 위에 움짤에서 발생하는 현상을 방지할 수 있다.

1. state: 0
2. DOM에 그려짐
3. useEffect()
4. state: 1
5. DOM에 그려짐

이런 과정이 아닌

1. state: 0
2. useLayoutEffect()
3. state: 1
4. DOM에 그려짐

이런 과정을 거치게 되기 때문에, 위에 움짤처럼 0에서 1로 바뀌는 상황을 유저가 알아채지 못하게 된다.

![](https://velog.velcdn.com/images/bokdol11859/post/b036d246-7b5e-44d3-8af8-724c7ffcf89e/image.gif)

### 5. Browser Paints Screen

가상DOM에 발생한 변경점들을 브라우저 DOM에 적용하는 시점이다. 이 과정이 끝나면 유저는 화면에 컴포넌트가 그려진 것을 볼 수 있다.

### 6. Run Effects

useEffect에 전달된 콜백함수가 호출이 되는 시점이다. 일반적으로 이 단계에서 복잡한 로직들을 수행을 하고, 백엔드 API에 요청을 보낸다.

## 업데이트 단계

### 1. Render

마운트 단계에서 실행되는 Render와 동일하다.

### 2. React Updates DOM

마찬가지도 마운드 단계와 동일하다.

### 3. Cleanup LayoutEffect

원래 마운트 단계에서는 이 시점에 LayoutEffect가 실행이 됐지만, 업데이트 단계에서는 LayoutEffect의 Cleanup 함수가 먼저 실행이 된다.

### 4. Run LayoutEffect

이전 단계에서 Cleanup이 실행이 되고 나면, 그제서야 LayoutEffect의 콜백함수가 호출이 된다. 나머지는 마운트 단계와 동일하다.

업데이트 단계에서는 Cleanup LayoutEffect와 Run LayoutEffect 모두 의존성배열에 있는 객체가 변경이 되었을 때만 실행이 된다. 만약 의존성배열이 전달되지 않은 경우에는 매번 실행이 된다.

### 5. Browser Paints Screen

마운트 단계와 동일하게 브라우저DOM에 변경사항을 적용하는 시점이다.

### 6. Cleanup Effect

원래 마운트 단계에서는 이 시점에 Run Effect가 실행이 됐지만, 업데이트 단계에서는 Cleanup 함수가 먼저 실행이 된다.

### 7. Run Effect

이전 단계에서 Cleanup이 실행이 되고 나면, 그제서야 Effect의 콜백함수가 호출이 된다. 나머지는 마운트 단계와 동일하다.

업데이트 단계에서는 Cleanup Effect와 Run Effect 모두 의존성배열에 있는 객체가 변경이 되었을 때만 실행이 된다. 만약 의존성배열이 전달되지 않은 경우에는 매번 실행이 된다.

## 언마운트 단계

### 1. Cleanup LayoutEffect

업데이트 단계에서는 의존성배열에 담긴 객체가 변경이 되었을 때만 실행이 됐지만, 언마운트 단계에서는 매번 Cleanup이 진행된다.

### 2. Cleanup Effect

마찬가지로 업데이트 단계에서는 의존성배열에 담긴 객체가 변경이 되었을 때만 실행이 됐지만, 언마운트 단계에서는 매번 Cleanup이 진행된다.

## 결론

사실 이렇게 보면 클래스 컴포넌트의 생명주기와 함수 컴포넌트의 생명주기가 거의 비슷하다는 생각이 들 수가 있다. 어떻게 보면 정말 비슷해보이기도 한다.

componentDidMount === useEffect(() => {}, [])

componentDidUpdate === useEffect(() => {})

componentWillUnmount = useEffect(() => { () => {} }, ) Cleanup Funtion

이렇게 생각을 할 수가 있다.

하지만 두 생명주기는 비슷하면서도 내부 작동방식은 아예 다르다. 그 이유는 리액트 훅이 자바스크립트의 Closure랑 밀접하게 관련이 있기 때문이다.

왜 다른지는 추후에 클로저에 관해 블로그 글을 작성할 예정이니, 거기서 자세히 다뤄보도록 하겠다.

다르다는걸 보여주는게 그래도 좋을 것 같아서 움짤을 두장 가져와봤다.

> Class Components
> ![](https://velog.velcdn.com/images/bokdol11859/post/5bdccbb2-5772-44a1-8c06-938c6c7af439/image.gif)

> Function Components
> ![](https://velog.velcdn.com/images/bokdol11859/post/1267cd21-bf41-4f53-9dac-424ca387e7da/image.gif)

> 출처: https://overreacted.io/a-complete-guide-to-useeffect/

## 그럼 왜 다른지는 다음 글에서. . .
