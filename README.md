## Difference from React

-  use "" instead of {} for padding variable or cb to element's attribute
-  Can not define many component in one file
-  Can not decision rendering
-  Can not assign template in to variable
-  Child component props will remind in init render and don't change, so use :key to make
   Vue track the change of the key, when the key change, the props will pass to child component

#### Listening Event

-  v-on:click="cb" or @click="cb" or :onClick=""

#### Watch

-  Specific option immediate: true to make call back immediately run
-  Only watch change inside source (ref, getter or array)

#### WatchEffect

-  run callback immediately run
-  Automatically track ref inside call back

#### Spread props to element

-  Define named prop attrs ad Partial(Attribute>)
-  Then use v-bind="attrs"
