<!-- markdownlint-disable-next-line no-inline-html -->
<h1 id="top">The PubSub module</h1>

1. [Events](#events)
2. [Topics](#topics)
3. [Types](#types)
4. [Subscribing](#subscribing)
   1. [subscribe](#subscribe)
   2. [subscribeToAllTopics](#subscribeToAllTopics)
5. [Unsubscribing](#unsubscribing)
   1. [unsubscribe](#unsubscribe)
   2. [unsubscribeFromAllTopics](#unsubscribeFromAllTopics)
6. [Publishing](#publishing)
   1. [publish](#publish)
   2. [publishToAllTopicsOnly](#publishToAllTopicsOnly)
7. [Utilities](#utilities)
   1. [getSubscriberCount](#getSubscriberCount)
   2. [getAllTopicsSubscriberCount](#getAllTopicsSubscriberCount)
   3. [hasSubscribers](#hasSubscribers)
   4. [hasAllTopicsSubscribers](#hasAllTopicsSubscribers)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="events">Events</h2>

Examples of possible events to publish include:

- CSS_TRANSITION_RUN
- FORM_UPDATE
- FORM_SUBMIT
- FORM_SUBMITTED
- INPUT_UPDATE
- BLUR
- MASK
- DISABLE
- POINTER_OVER
- And anything else needed to decouple components.

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="topics">Topics</h2>

The "all topics" topic `PUBSUB_ALL_TOPICS` might be useful for, say, logging.

**Note: don't use "PUBSUB_ALL_TOPICS" as a topic!** You can set this to a different value if necessary in the [constants](pubsub/../constants.ts) file.

Otherwise, a typical topic might be a form (mutation) ID, used to connect form fields to their form via the event bus. But topics can be anything you want. They exist to allow subscribers to respond only to certain events and not others.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="types">Types</h2>

Here are the associated [types](pubsub/../types.ts):

```ts
type PubSubEvent = {
  id?: string
  eventName: string
  timestamp?: Temporal.ZonedDateTime
  data?: {
    [key: string]: unknown
  }
}

type Subscriptions = {
  [token: string]: (event: PubSubEvent) => void
}

type Topics = {
  [topic: string]: Subscriptions
}

type Subscribers = {
  once?: Topics
  always?: Topics
}
```

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="subscribing">Subscribing</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="subscribe"><a href="#subscribe">subscribe</a></h3>

```ts
subscribe(
  token: string,
  callback: (event: PubSubEvent) => void,
  options: {
    topic: string
    once?: boolean
  },
): string | Error
```

- The `token` is a unique ID that identifies the subscription.
- The `callback` is the function to be called with the event on `publish`. Callbacks are stored in the [subscribers](subscribers/index.ts) map.
- The `token` and the `callback` form a Subscription in the `subscribers` map.
- The `topic` is required. It allows subscribers to subscribe to specific events. To subscribe to all events, see `subscribeToAllTopics` below.
- If `once` is set to true, the subscription will be unsubscribed the first time the callback is called. Otherwise, it will respond until it is formally unsubscribed.

<!-- markdownlint-disable-next-line no-inline-html -->
<br />

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="subscribeToAllTopics"><a href="#subscribeToAllTopics">subscribeToAllTopics</a></h3>

```ts
subscribeToAllTopics(
  token: string,
  callback: (event: PubSubEvent) => void,
  options?: {
    once?: boolean
  },
): string | Error
```

- Sets the `topic` to PUBSUB_ALL_TOPICS internally. These subscribers are called for **every** event, no matter what the topic.
- If `once` is `true`, then the subscription is automatically unsubscribed after the first event.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="unsubscribing">Unsubscribing</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="unsubscribe"><a href="#unsubscribe">unsubscribe</a></h3>

```ts
unsubscribe(
  token?: string,
  topic?: string,
  options: {
    onlyFromOnce?: boolean
  } = {},
): void
```

- Both `token` and `topic` are optional.
- If neither is provided, _all_ subscriptions are unsubscribed.
- If only the `token` is provided, then all subscriptions for that `token` are unsubscribed.
- If only the `topic` is provided, then all subscriptions for that `topic` are unsubscribed.
- If both `token` and `topic` are provided, then only the subscription for that `token` on that `topic` is unsubscribed.
- To unsubscribe an AllTopics subscription, use the `unsubscribeFromAllTopics` function below.
- If `onlyFromOnce` is `true`, only subscriptions in the `once` map are unsubscribed.
- If `onlyFromOnce` is `false`, only subscriptions in the `always` map are unsubscribed.
- If `onlyFromOnce` is **`undefined`**, then subscriptions in both maps are unsubscribed.

<!-- markdownlint-disable-next-line no-inline-html -->
<br />

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="unsubscribeFromAllTopics"><a href="#unsubscribe-from-all-topics">unsubscribeFromAllTopics</a></h3>

```ts
unsubscribeFromAllTopics(
  token?: string,
  options?: {
    onlyFromOnce?: boolean
  },
): void
```

- If the `token` is provided, then all AllTopics subscriptions for that `token` are unsubscribed.
- If `onlyFromOnce` is `true`, only subscriptions for AllTopics in the `once` map are unsubscribed.
- If `onlyFromOnce` is `false`, only subscriptions for AllTopics in the `always` map are unsubscribed.
- If `onlyFromOnce` is `undefined`, then subscriptions for AllTopics in both maps are unsubscribed.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="publishing">Publishing</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="publish"><a href="#publish">publish</a></h3>

```ts
publish(
  event: PubSubEvent,
  options: {
    topic?: string
  } = {},
): Temporal.ZonedDateTime | Error
```

- The `event` is required. It should have a unique ID. ID (generateShortId) and timestamp (Temporal.ZonedDateTime) are automatically generated.
  - ID can be overridden.
  - Timestamp cannot be overridden.
- If the optional `topic` is provided, then only subscribers to that topic receive the event.
- If the optional `topic` is not provided, then all subscribers receive the event.
- After calling `once` callbacks, they are unsubscribed (they never receive more than a single event).
- To publish only to AllTopics subscribers, use `publishToAllTopicsOnly` below.

<!-- markdownlint-disable-next-line no-inline-html -->
<br />

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="publishToAllTopicsOnly"><a href="#publish-to-all-topics-only">publishToAllTopicsOnly</a></h3>

```ts
publishToAllTopicsOnly(
  event: PubSubEvent,
  options = {},
): Temporal.ZonedDateTime | Error
```

- The `event` is required (as above). It should have a unique ID. ID (generateShortId) and timestamp (Temporal.ZonedDateTime) are automatically generated.
  - ID can be overridden.
  - Timestamp cannot be overridden.
- The event is published only to AllTopics subscribers.

[top](#top)

<!-- markdownlint-disable-next-line no-inline-html -->
<h2 id="Publishing">Utilities</h2>

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="getSubscriberCount"><a href="#get-subscriber-count">getSubscriberCount</a></h3>

```ts
getSubscriberCount(
  options: {
    topic?: string
    onlyFromOnce?: boolean
  } = {},
): number
```

- If `topic` is included, then only subscribes to that topic are counted.
- To count only "all topics" subscribers, use `getAllTopicsSubscriberCount` below.
- If `onlyOnce` is `true`, then only `once` (one time) subscriptions are counted.
- If `onlyOnce` is `false`, then only `always` subscriptions are counted.
- If `onlyOnce` is `undefined`, then both once and always are subscriptions are counted.

<!-- markdownlint-disable-next-line no-inline-html -->
<br />

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="getAllTopicsSubscriberCount"><a href="#get-all-topics-subscriber-count">getAllTopicsSubscriberCount</a></h3>

```ts
getAllTopicsSubscriberCount(
  options: {
    onlyFromOnce?: boolean
  } = {},
): number
```

- Counts only PUBSUB_ALL_TOPICS subscriptions
- If `onlyOnce` is `true`, then only `once` (one time) subscriptions are counted.
- If `onlyOnce` is `false`, then only `always` subscriptions are counted.
- If `onlyOnce` is `undefined`, then both once and always are subscriptions are counted.

<!-- markdownlint-disable-next-line no-inline-html -->
<br />

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="hasSubscribers"><a href="#has-subscribers">hasSubscribers</a></h3>

```ts
hasSubscribers(
  options: {
    topic?: string
    onlyFromOnce?: boolean
  } = {},
): boolean
```

- Nothing more than sugar around the `getSubscriberCount` function to return a boolean.
- Uses `getSubscriberCount` under the covers.

<!-- markdownlint-disable-next-line no-inline-html -->
<br />

<!-- markdownlint-disable-next-line no-inline-html -->
<h3 id="hasAllTopicsSubscribers"><a href="#has-all-topics-subscribers">hasAllTopicsSubscribers</a></h3>

```ts
hasAllTopicsSubscribers(
  options: {
    onlyFromOnce?: boolean
  } = {},
): boolean
```

- Nothing more than sugar around the `getAllTopicsSubscriberCount` function to return a boolean.
- Uses `getSubscriberCount` under the covers to avoid a second function call.

[top](#top)
