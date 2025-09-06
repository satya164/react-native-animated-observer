package com.animatedobserver

import android.util.Log
import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.Event
import com.facebook.react.viewmanagers.AnimatedObserverViewManagerDelegate
import com.facebook.react.viewmanagers.AnimatedObserverViewManagerInterface
import java.util.concurrent.ConcurrentHashMap

@ReactModule(name = AnimatedObserverViewManager.NAME)
class AnimatedObserverViewManager : SimpleViewManager<View>(),
  AnimatedObserverViewManagerInterface<View> {
  private val mDelegate: ViewManagerDelegate<View> =
    AnimatedObserverViewManagerDelegate(this)

  private var manager: AnimatedObserverEventManager? = null;

  override fun createViewInstance(context: ThemedReactContext): View {
    val view = View(context)

    manager?.cleanup()
    manager = AnimatedObserverEventManager({ value ->
      val reactContext = view.context as ReactContext
      val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
      val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, surfaceId)
        ?: throw IllegalStateException("$AnimatedObserverViewManager.NAME: EventDispatcher is not available for surfaceId: $surfaceId")

      eventDispatcher.dispatchEvent(ValueChangeEvent(surfaceId, view.id, value))
    })

    return view;
  }

  override fun onDropViewInstance(view: View) {
    manager?.cleanup()
    manager = null

    super.onDropViewInstance(view)
  }

  override fun prepareToRecycleView(
    reactContext: ThemedReactContext,
    view: View
  ): View? {
    manager?.cleanup()
    manager = null

    return super.prepareToRecycleView(reactContext, view)
  }

  override fun getDelegate() = mDelegate

  override fun getName() = NAME

  override fun getExportedCustomDirectEventTypeConstants() = mapOf(
    EVENT_ON_CHANGE to mapOf("registrationName" to EVENT_ON_CHANGE)
  )

  @ReactProp(name = "tag")
  override fun setTag(view: View, nextTag: String?) {
    manager?.tag = nextTag
  }

  @ReactProp(name = "value")
  override fun setValue(view: View, nextValue: Double) {
   manager?.value = nextValue
  }

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
    const val EVENT_ON_CHANGE = "topValueChange"
  }
}
