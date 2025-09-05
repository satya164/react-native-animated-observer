#import "AnimatedObserverView.h"

#import <react/renderer/components/AnimatedObserverViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/AnimatedObserverViewSpec/EventEmitters.h>
#import <react/renderer/components/AnimatedObserverViewSpec/Props.h>
#import <react/renderer/components/AnimatedObserverViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCTConversions.h"

#import "AnimatedObserver-Swift.h"

using namespace facebook::react;

@interface AnimatedObserverView () <RCTAnimatedObserverViewViewProtocol>

@end

@implementation AnimatedObserverView {
  UIView * _view;
  AnimatedObserverEventManager * _manager;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<AnimatedObserverViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const AnimatedObserverViewProps>();
    _props = defaultProps;
    
    _view = [[UIView alloc] init];
    _manager = [[AnimatedObserverEventManager alloc] initWithEmit:^(double value) {
      auto eventEmitter = std::static_pointer_cast<const AnimatedObserverViewEventEmitter>(self->_eventEmitter);
      
      if (eventEmitter) {
        eventEmitter->onValueChange(AnimatedObserverViewEventEmitter::OnValueChange{
          .value = value
        });
      }
      
      // This is temporary workaround to allow animations based on onPageScroll event
      // until Fabric implements proper NativeAnimationDriver,
      // see: https://github.com/facebook/react-native/blob/44f431b471c243c92284aa042d3807ba4d04af65/packages/react-native/React/Fabric/Mounting/ComponentViews/ScrollView/RCTScrollViewComponentView.mm#L59
      ValueChangeEvent *event = [[ValueChangeEvent alloc] initWithReactTag:@(self.tag)
                                                                     value:value];
      NSDictionary *userInfo = @{@"event": event};
      [[NSNotificationCenter defaultCenter] postNotificationName:@"RCTNotifyEventDispatcherObserversOfEvent_DEPRECATED"
                                                          object:nil
                                                        userInfo:userInfo];
    }];
    
    self.contentView = _view;
  }
  
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<AnimatedObserverViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<AnimatedObserverViewProps const>(props);
  
  if (oldViewProps.tag != newViewProps.tag) {
    [_manager setTag:RCTNSStringFromString(newViewProps.tag)];
  }
  
  if (oldViewProps.value != newViewProps.value) {
    [_manager setValue:newViewProps.value];
  }
  
  [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  [_manager dispose];
}

@end
