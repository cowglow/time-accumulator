import { act, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

type Wrapper = ComponentType<{ children: ReactNode }>;

export function renderHook<T>(
  useHookFn: () => T,
  options?: { wrapper?: Wrapper }
) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  const result = { current: undefined as unknown as T };

  function HookProbe() {
    result.current = useHookFn();
    return null;
  }

  const Wrapper = options?.wrapper;

  const render = () => {
    act(() => {
      root.render(Wrapper ? <Wrapper><HookProbe /></Wrapper> : <HookProbe />);
    });
  };

  render();

  return {
    result,
    rerender: render,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}
