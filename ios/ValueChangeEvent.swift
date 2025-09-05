import React

// RCTEvent is not defined for new arch.
protocol RCTEvent {}

@objcMembers
public class ValueChangeEvent: NSObject, RCTEvent {
  private var value: Double
  public var viewTag: NSNumber
  
  public var eventName: String {
    "onValueChange"
  }
  
  public init(reactTag: NSNumber, value: Double) {
    self.viewTag = reactTag
    self.value = value
    super.init()
  }
  
  public class func moduleDotMethod() -> String {
    "RCTEventEmitter.receiveEvent"
  }
  
  public func canCoalesce() -> Bool {
    false
  }
  
  public func arguments() -> [Any] {
    [
      viewTag,
      RCTNormalizeInputEventName(eventName) ?? eventName,
      [
        "value": value
      ]
    ]
  }
}
