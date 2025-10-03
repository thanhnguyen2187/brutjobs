import { onMount } from "svelte";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  let value = $state<T>(initialValue);

  onMount(() => {
    const currentValue = localStorage.getItem(key);
    if (currentValue) value = JSON.parse(currentValue);
  });

  $effect(() => {
    save();
  });

  const save = () => {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  };

  return {
    get value(): T {
      return value;
    },
    set value(v: T) {
      value = v;
    },
  };
};

export default useLocalStorage;
