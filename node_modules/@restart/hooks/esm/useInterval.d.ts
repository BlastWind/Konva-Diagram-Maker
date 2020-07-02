/**
 * Creates a `setInterval` that is properly cleaned up when a component unmounted
 *
 * @param fn an function run on each interval
 * @param ms The milliseconds duration of the interval
 */
declare function useInterval(fn: () => void, ms: number): void;
/**
 * Creates a pasuable `setInterval` that is properly cleaned up when a component unmounted
 *
 * @param fn an function run on each interval
 * @param ms The milliseconds duration of the interval
 * @param paused Whether or not the interval is currently running
 */
declare function useInterval(fn: () => void, ms: number, paused: boolean): void;
export default useInterval;
