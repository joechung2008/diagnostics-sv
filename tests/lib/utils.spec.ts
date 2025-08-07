import { describe, it, expect, vi } from "vitest";
import {
  byKey,
  isExtensionInfo,
  toNavLink,
  when,
  fetchDiagnostics,
} from "../../src/lib/utils";

describe("utils.ts", () => {
  it("byKey sorts by key ascending", () => {
    const a = { key: "a", name: "A", url: "" };
    const b = { key: "b", name: "B", url: "" };
    const c = { key: "c", name: "C", url: "" };

    const shuffled = [b, c, a];
    const sorted = shuffled.sort(byKey);

    expect(sorted).toEqual([a, b, c]);
  });

  it("isExtensionInfo identifies ExtensionInfo and rejects error shape", () => {
    const info = {
      extensionName: "ext",
      config: undefined,
      stageDefinition: undefined,
    };
    const error = {
      lastError: {
        errorMessage: "boom",
        time: "now",
      },
    };

    expect(isExtensionInfo(info)).toBe(true);
    expect(isExtensionInfo(error)).toBe(false);
    expect(isExtensionInfo(undefined)).toBe(false);
  });

  it("toNavLink maps ExtensionInfo to a keyed nav link", () => {
    const info = {
      extensionName: "ext",
      config: undefined,
      stageDefinition: undefined,
    };

    const link = toNavLink(info);
    expect(link).toEqual({ key: "ext", name: "ext", url: "" });
  });

  it("when returns args if condition is true, otherwise empty array", () => {
    expect(when(true, 1, 2, 3)).toEqual([1, 2, 3]);
    expect(when(false, 1, 2, 3)).toEqual([]);
  });

  it("byKey returns 0 for equal keys", () => {
    const x = { key: "a", name: "X", url: "" };
    const y = { key: "a", name: "Y", url: "" };
    expect(byKey(x, y)).toBe(0);
  });

  it("isExtensionInfo returns false for non-objects and non-infos", () => {
    expect(isExtensionInfo(null as unknown as Extension)).toBe(false);
    expect(isExtensionInfo(0 as unknown as Extension)).toBe(false);
    expect(isExtensionInfo("x" as unknown as Extension)).toBe(false);
    expect(isExtensionInfo([] as unknown as Extension)).toBe(false);
    expect(isExtensionInfo({} as unknown as Extension)).toBe(false);
  });

  it("toNavLink returns only key,name,url for a given ExtensionInfo", () => {
    const info: ExtensionInfo & { extra: string } = {
      extensionName: "ext",
      config: {},
      stageDefinition: {},
      extra: "ignored",
    };
    const link = toNavLink(info);
    expect(link).toEqual({ key: "ext", name: "ext", url: "" });
  });

  it("when with no args returns empty array regardless of condition", () => {
    expect(when(true)).toEqual([]);
    expect(when(false)).toEqual([]);
  });

  it("when preserves reference identity of arguments", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const result = when(true, obj1, obj2);
    expect(result[0]).toBe(obj1);
    expect(result[1]).toBe(obj2);
  });

  it("fetchDiagnostics returns parsed JSON from fetch", async () => {
    const data = { ok: 1 };
    const json = vi.fn().mockResolvedValue(data);
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ json } as unknown as Response);

    const url = "https://example.test/diagnostics";
    const result = await fetchDiagnostics(url);

    expect(fetchSpy).toHaveBeenCalledWith(url);
    expect(result).toEqual(data);

    fetchSpy.mockRestore();
  });
});
