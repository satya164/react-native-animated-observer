package com.animatedobserver

import android.content.Context
import android.util.AttributeSet
import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

class AnimatedObserverView : View {
  constructor(context: Context?) : super(context)
  constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
  constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(
    context,
    attrs,
    defStyleAttr
  )

  val manager: AnimatedObserverEventManager = AnimatedObserverEventManager({ value ->
    val reactContext = context as ReactContext
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, surfaceId)
      ?: throw IllegalStateException("$NAME: EventDispatcher is not available for surfaceId: $surfaceId")

    eventDispatcher.dispatchEvent(ValueChangeEvent(surfaceId, this.id, value))
  })

  inner class ValueChangeEvent(
    surfaceId: Int, viewId: Int, private val value: Double
  ) : Event<ValueChangeEvent>(surfaceId, viewId) {
    override fun getEventName() = EVENT_ON_CHANGE

    override fun getEventData(): WritableMap = Arguments.createMap().apply {
      putDouble("value", value)
    }
  }

  companion object {
    const val NAME = "AnimatedObserverView"

    /**
     * On Android, it's necessary to use the `top` prefix for event names
     * Otherwise, it doesn't work with `Animated.event` using `useNativeDriver: true`
     */
    const val EVENT_ON_CHANGE = "topValueChange"
  }
}
