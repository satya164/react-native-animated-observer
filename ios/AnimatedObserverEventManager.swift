import Foundation

@objc
public class AnimatedObserverEventManager : NSObject {
  private let emit: (Double) -> Void
  
  @objc
  public init(emit: @escaping (Double) -> Void) {
    self.emit = emit
  }
  
  private static var observers: [String: [AnimatedObserverEventManager]] = [:]
  
  private func add(tag: String) -> () -> Void {
    Self.observers[tag, default: []].append(self)
    
    return {
      Self.observers[tag]?.removeAll {
        $0 === self
      }
      
      if Self.observers[tag]?.isEmpty ?? true {
        Self.observers[tag] = nil
      }
    }
  }
  
  private func notify() {
    guard let tag else { return }
    
    AnimatedObserverEventManager.observers[tag]?.forEach {
      $0.emit(self.value)
    }
  }
  
  private var remove: (() -> Void)?
  
  @objc
  public var tag: String? {
    didSet {
      self.remove?()
      
      if let tag = self.tag {
        self.remove = self.add(tag: tag)
        self.notify()
      }
    }
  }
  
  @objc
  public var value: Double = 0.0 {
    didSet {
      self.notify()
    }
  }
  
  @objc
  public func dispose() {
    self.remove?()
  }
}
