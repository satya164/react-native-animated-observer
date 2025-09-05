package com.animatedobserver

import android.util.Log
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
class AnimatedObserverViewManager : SimpleViewManager<AnimatedObserverView>(),
  AnimatedObserverViewManagerInterface<AnimatedObserverView> {
  private val mDelegate: ViewManagerDelegate<AnimatedObserverView> =
    AnimatedObserverViewManagerDelegate(this)

  override fun createViewInstance(context: ThemedReactContext): AnimatedObserverView {
    return AnimatedObserverView(context)
  }

  override fun onDropViewInstance(view: AnimatedObserverView) {
    cleanup()
    super.onDropViewInstance(view)
  }

  override fun getDelegate() = mDelegate

  override fun getName() = NAME

  override fun getExportedCustomDirectEventTypeConstants() = mapOf(
    EVENT_ON_CHANGE to mapOf("registrationName" to EVENT_ON_CHANGE)
  )

  private var value: Double? = null
  private var tag: String? = null

  private var unregister: (() -> Unit)? = null

  private fun cleanup() {
    unregister?.invoke()
    unregister = null
  }

  @ReactProp(name = "tag")
  override fun setTag(view: AnimatedObserverView, nextTag: String?) {
    Log.d(NAME, "setTag called with tag: $nextTag")

    cleanup()

    tag = nextTag
    tag?.let { currentTag ->
      val reactContext = view.context as ReactContext
      val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
      val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, surfaceId)
        ?: throw IllegalStateException("AnimatedObserverView: EventDispatcher is not available for surfaceId: $surfaceId")

      unregister = register(currentTag) { value ->
        eventDispatcher.dispatchEvent(ValueChangeEvent(surfaceId, view.id, value))
      }
    }

    emit()
  }

  @ReactProp(name = "value")
  override fun setValue(view: AnimatedObserverView, nextValue: Double) {
    Log.d(NAME, "setValue called with value: $nextValue for tag: $tag")

    value = nextValue

    emit()
  }

  fun register(tag: String, callback: (Double) -> Unit): () -> Unit {
    val callbackList = observers.getOrPut(tag) { mutableListOf() }

    synchronized(callbackList) {
      callbackList.add(callback)
    }

    return {
      observers[tag]?.let { callbacks ->
        synchronized(callbacks) {
          callbacks.remove(callback)

          if (callbacks.isEmpty()) {
            observers.remove(tag)
          }
        }
      }
    }
  }

  fun emit() {
    Log.d(NAME, "Notifying observers for tag: $tag with value: $value")

    tag?.let { currentTag ->
      value?.let { currentValue ->
        observers[tag]?.toList()?.forEach { callback ->
          try {
            Log.d(NAME, "Calling callback: $tag with value: $value")

            callback(currentValue)
          } catch (e: Exception) {
            Log.e(NAME, "Error notifying observer: ${e.message}")
          }
        }
      }
    }
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

    private val observers = ConcurrentHashMap<String, MutableList<(Double) -> Unit>>()
  }
}
