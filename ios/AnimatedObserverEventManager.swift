import Foundation

actor Observers {
  static var items: [String: [AnimatedObserverEventManager]] = [:]
}

@objc
public class AnimatedObserverEventManager : NSObject {
  private let emit: (Double) -> Void
  
  @objc
  public init(emit: @escaping (Double) -> Void) {
    self.emit = emit
  }
  
  private func add(tag: String) -> () -> Void {
    Observers.items[tag, default: []].append(self)
    
    return {
      Observers.items[tag]?.removeAll {
        $0 === self
      }
      
      if Observers.items[tag]?.isEmpty ?? true {
        Observers.items[tag] = nil
      }
    }
  }
  
  private func notify() {
    guard let tag else { return }
    
    Observers.items[tag]?.forEach {
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
